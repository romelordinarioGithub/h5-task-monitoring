import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import _ from 'lodash';

import Swal from 'sweetalert2';

import { useFileUpload } from 'use-file-upload';

import moment from 'moment';

// Reducers
import { fetchPartners } from 'store/reducers/partners';
import { fetchTimezone, fetchTeams, fetchRegion } from 'store/reducers/profile';
import {
  updateUserProfile,
  updateProfilePicture,
  updateChangePassword,
} from 'store/reducers/user';

//MUI Components
import { Box, Stack, Typography, styled, Tab, Tabs } from '@mui/material';

// Mui Icons
import AccountBoxIcon from '@mui/icons-material/AccountBox';
// import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';
import GroupsIcon from '@mui/icons-material/Groups';

// App hooks
// import useRouteGuard from 'hooks/useRouteGuard';

// App Components
import General from 'pages/Profile/pages/General';
import Department from 'pages/Profile/pages/Department';
import ChangePassword from 'pages/Profile/pages/ChangePassword';

// constant
import { days, roles, passwordRules } from 'pages/Profile/constant';

const AntTabs = styled(Tabs)({
  '& .MuiTabs-indicator': {
    backgroundColor: '#7c3aed',
  },
});

const AntTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    padding: '12px 0 12px 0',
    textTransform: 'none',
    minWidth: 0,
    [theme.breakpoints.up('sm')]: {
      minWidth: 0,
    },
    fontWeight: theme.typography.fontWeightBold,
    marginRight: theme.spacing(4),
    color: '#717182',
    minHeight: 'auto',
    '&:hover': {
      color: '#7c3aed',
      opacity: 1,
    },
    '&.Mui-selected': {
      color: '#7c3aed',
      fontWeight: 700,
    },
    '&.Mui-focusVisible': {
      backgroundColor: '#f5f3ff',
    },
  })
);

// const breadcrumbs = [
//   <Link underline="hover" key="1" color="inherit" href="/">
//     Ad-Weave
//   </Link>,
//   <Typography key="3" color="text.primary">
//     User Profile
//   </Typography>,
// ];

// Toast notification
const Toast = Swal.mixin({
  toast: true,
  icon: 'success',
  width: 370,
  position: 'top-right',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

const ToastError = Swal.mixin({
  toast: true,
  icon: 'error',
  width: 370,
  position: 'top-right',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

const Profile = () => {
  // useRouteGuard();
  const dispatch = useDispatch();

  const { data: user } = useSelector((state) => state.user);
  const { list: partnersList } = useSelector((state) => state.partners);
  const {
    timezone: { data: timzeonData },
    team: { data: teamList },
    region: { data: regionData },
  } = useSelector((state) => state.profile);

  const [tab, setTab] = useState(0);

  const [, selectFiles] = useFileUpload();
  // const [phone, setPhone] = useState(user?.mobile_number);
  const [region, setRegion] = useState(user?.region?.toUpperCase());
  const [startDay, setStartDay] = useState(user?.schedule_from);
  const [endDay, setEndDay] = useState(user?.schedule_to);
  const [startTime, setStartTime] = useState(user?.time_from);
  const [endTime, setEndTime] = useState(user?.time_to);
  const [uTimezone, setTimeZone] = useState(user?.timezone);
  const [upartners, setPartners] = useState(
    _.filter(user?.partners, (partner) => {
      return (
        partner.id !== '' && partner.partner_id !== '' && partner.name !== null
      );
    })
  );
  const [team, setTeam] = useState(user?.team_id);
  // const [startDate, setStartDate] = useState(user?.start_date);
  const [role, setRole] = useState(user?.user_role);
  // const [manager, setManager] = useState(user?.manager_id);
  const [password, setPassword] = useState('');
  const [current_password, setCurrentPassword] = useState('');
  const [password_confirmation, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState({
    isCurrent: false,
    isNew: false,
    isConfirm: false,
  });

  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const queue = urlParams.get('queue');

  useEffect(() => {
    dispatch(fetchPartners());
    dispatch(fetchTimezone());
    dispatch(fetchTeams());
    dispatch(fetchRegion());
  }, []);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleClickShowPassword = (event, name) => {
    switch (name) {
      case 'current':
        setShowPassword({
          ...showPassword,
          isCurrent: !showPassword.isCurrent,
        });
        break;
      case 'new':
        setShowPassword({ ...showPassword, isNew: !showPassword.isNew });
        break;
      case 'confirm':
        setShowPassword({
          ...showPassword,
          isConfirm: !showPassword.isConfirm,
        });
        break;
    }
  };

  const handleProfilePicUpload = (file) => {
    const form = new FormData();

    form.append('id', user?.id);
    form.append('files', file.file);

    dispatch(updateProfilePicture(form));
  };

  const handleSaveChanges = () => {
    dispatch(
      updateUserProfile({
        id: user?.id,
        region: region,
        schedule_from: startDay,
        schedule_to: endDay,
        time_from: moment(startTime).format('YYYY-MM-DD HH:mm:ss'),
        time_to: moment(endTime).format('YYYY-MM-DD HH:mm:ss'),
        timezone: uTimezone,
        partner_id: _.map(upartners, (partner) => partner?.id).toString(),
        team_id: team,
        role: _.filter(roles, (r) => r.name === role)[0].id,
        password: password,
        password_confirmation: password_confirmation,
        queue,
      })
    );

    Toast.fire({
      title: 'Account updated successfully!',
    });
  };

  const handleSavePassword = () => {
    if (user.first_login ?? false) {
      dispatch(
        updateUserProfile({
          id: user?.id,
          password: password,
          password_confirmation: password_confirmation,
          queue,
        })
      );
    } else {
      dispatch(
        updateChangePassword(
          {
            id: user?.id,
            current_password: current_password,
            password: password,
            password_confirmation: password_confirmation,
          },
          () => {
            Toast.fire({
              title: 'Password updated!',
            });
          },
          (error) => {
            ToastError.fire({
              title: error,
            });
          }
        )
      );
    }
  };

  const handleSaveProfile = () => {
    dispatch(
      updateUserProfile({
        id: user?.id,
        team_id: team,
        role: _.filter(roles, (r) => r.name === role)[0].id,
        queue,
      })
    );

    Toast.fire({
      title: 'Account updated successfully!',
    });
  };

  const handleSaveGeneral = () => {
    dispatch(
      updateUserProfile({
        id: user?.id,
        region: region,
        schedule_from: startDay,
        schedule_to: endDay,
        time_from: moment(startTime).format('YYYY-MM-DD HH:mm:ss'),
        time_to: moment(endTime).format('YYYY-MM-DD HH:mm:ss'),
        timezone: uTimezone,
        partner_id: _.map(upartners, (partner) => partner?.id).toString(),
        team_id: team,
        role: _.filter(roles, (r) => r.name === role)[0].id,
        queue,
      })
    );

    Toast.fire({
      title: 'Account updated successfully!',
    });
  };

  return (
    <Box
      sx={{
        overflowY: 'auto',
        height: 'calc(100vh - 40px)',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        background:
          'radial-gradient(circle at top right, rgba(124, 58, 237, 0.08), transparent 26rem), #f7f8fc',
      }}
    >
      <Box sx={{ width: 'min(1000px, calc(100% - 32px))' }}>
        <Stack py={3}>
          <Box mb={1}>
            <Typography variant="h4" fontWeight={800} color="#111827">
              Account Settings
            </Typography>
            <Typography color="#717182" fontSize={13} mt={0.5}>
              Manage profile preferences, team details, and account access.
            </Typography>
          </Box>
          <Box>
            <AntTabs value={tab} onChange={handleChange} aria-label="user-tab">
              <AntTab
                label="General"
                icon={<AccountBoxIcon sx={{ fontSize: 20 }} />}
                iconPosition="start"
              />
              <AntTab
                label="Department"
                icon={<GroupsIcon sx={{ fontSize: 20 }} />}
                iconPosition="start"
                disabled={
                  user?.first_login &&
                  (_.isEmpty(startDay) ||
                    _.isEmpty(endDay) ||
                    _.isNull(startTime) ||
                    _.isNull(endTime) ||
                    _.isEmpty(uTimezone))
                }
              />
              {/* <AntTab
                label="Change Password"
                icon={<VpnKeyRoundedIcon sx={{ fontSize: 20 }} />}
                iconPosition="start"
                disabled={
                  user?.first_login &&
                  (_.isEmpty(startDay) ||
                    _.isEmpty(endDay) ||
                    _.isNull(startTime) ||
                    _.isNull(endTime) ||
                    _.isEmpty(uTimezone))
                }
              /> */}
            </AntTabs>
            <Box sx={{ p: 2 }} />
          </Box>
          {tab === 0 ? (
            <General
              setTab={setTab}
              user={user}
              partners={partnersList}
              timezone={timzeonData}
              regionData={regionData}
              days={days}
              selectFiles={selectFiles}
              region={region}
              setRegion={setRegion}
              startDay={startDay}
              setStartDay={setStartDay}
              endDay={endDay}
              setEndDay={setEndDay}
              startTime={startTime}
              setStartTime={setStartTime}
              endTime={endTime}
              setEndTime={setEndTime}
              uTimezone={uTimezone}
              setTimeZone={setTimeZone}
              upartners={upartners}
              setPartners={setPartners}
              handleProfilePicUpload={handleProfilePicUpload}
              handleSaveChanges={handleSaveProfile}
              handleSaveGeneral={handleSaveGeneral}
            />
          ) : tab === 1 ? (
            <Department
              setTab={setTab}
              user={user}
              teamList={teamList}
              team={team}
              setTeam={setTeam}
              roles={roles}
              role={role}
              setRole={setRole}
              handleSaveChanges={handleSaveProfile}
            />
          ) : (
            <ChangePassword
              user={user}
              password={password}
              currentPassword={current_password}
              passwordConfirmation={password_confirmation}
              setPassword={setPassword}
              setConfirmPassword={setConfirmPassword}
              setCurrentPassword={setCurrentPassword}
              handleSaveChanges={handleSaveChanges}
              handleSavePassword={handleSavePassword}
              handleClickShowPassword={handleClickShowPassword}
              showPassword={showPassword}
              passwordRules={passwordRules}
            />
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default Profile;

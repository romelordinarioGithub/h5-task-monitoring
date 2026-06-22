import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation, matchPath } from 'react-router-dom';

import HeaderContext from 'components/Common/Header/context';

import _ from 'lodash';

import {
  Box,
  AppBar,
  List,
  Divider,
  ListItemIcon,
  Button,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
  Avatar,
} from '@mui/material';

import { useSelector } from 'react-redux';
import MenuIcon from '@mui/icons-material/Menu';
import ContactSupportTwoToneIcon from '@mui/icons-material/ContactSupportTwoTone';
import KeyboardArrowDownTwoToneIcon from '@mui/icons-material/KeyboardArrowDownTwoTone';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import HandshakeTwoToneIcon from '@mui/icons-material/HandshakeTwoTone';
import MoreIcon from '@mui/icons-material/MoreVert';
import InsightsTwoToneIcon from '@mui/icons-material/InsightsTwoTone';
import TimerTwoToneIcon from '@mui/icons-material/TimerTwoTone';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import SettingsSuggestTwoToneIcon from '@mui/icons-material/SettingsSuggestTwoTone';

import logo from 'assets/smartly/logo-initial-white.svg';
import { logout } from 'store/reducers/auth';
import { stringAvatar } from 'hooks';
import NotificationButton from 'components/Common/Header/component/NotificationButton';

const adweavePages = [
  {
    name: 'Dashboard',
    url: '/',
  },
  {
    name: 'Projects',
    url: '/projects',
  },
  {
    name: 'Brief',
    url: '/form',
  },
];

const ticketPages = [
  {
    name: 'Dashboard',
    url: '/',
  },
  {
    name: 'Projects',
    url: '/projects',
  },
];

const smartlyPages = [
  {
    name: 'Dashboard',
    url: '/',
  },
  {
    name: 'Brief',
    url: '/smartlybrief',
  },
];

function Main() {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { data: userData } = useSelector((state) => state.user);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const {
    unread,
    openSearch,
    openPreset,
    openNotification,
    handleOpenNotification,
    handleOpenSearch,
    handleOpenPreset,
    handleTaskCreation,
  } = React.useContext(HeaderContext);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        sx: {
          top: '7px !important',
        },
      }}
    >
      <Box sx={{ display: 'flex', minWidth: '210px', padding: '18px' }}>
        <Avatar
          {...stringAvatar(userData?.fullname, {
            width: 30,
            height: 30,
            fontSize: '14px',
            border: '1px solid #ffffff9c',
          })}
          variant="rounded"
          src={userData?.profile_picture}
        />
        <Box>
          <Box
            sx={{
              paddingLeft: '9px',
              textAlign: 'left',
              width: '130px',
            }}
          >
            <Typography noWrap variant="body1" color="primary" fontWeight={800}>
              {userData?.fullname}
            </Typography>
            <Typography variant="body2" color="#9ea4c199" noWrap>
              {userData?.team_name}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider />
      {/* {!(userData.is_smartly ?? false) && ( */}
      <MenuItem
        sx={{ margin: '0.5em 1em 0em', borderRadius: '8px' }}
        component={Link}
        to="/profile"
      >
        <ListItemIcon>
          <AccountBoxTwoToneIcon sx={{ width: '1.2em', height: '1.2em' }} />
        </ListItemIcon>
        Profile
      </MenuItem>
      {!(userData.is_smartly ?? false) && (
        <MenuItem
          sx={{ margin: '0em 1em', borderRadius: '8px' }}
          component={Link}
          to="/partners"
        >
          <ListItemIcon>
            <HandshakeTwoToneIcon sx={{ width: '1.2em', height: '1.2em' }} />
          </ListItemIcon>
          Partners
        </MenuItem>
      )}
      <MenuItem
        sx={{ margin: '0em 1em', borderRadius: '8px' }}
        component={Link}
        to="/timesheet"
      >
        <ListItemIcon>
          <InsightsTwoToneIcon sx={{ width: '1.2em', height: '1.2em' }} />
        </ListItemIcon>
        Time Sheet
      </MenuItem>
      {userData?.admin_panel_access && (
        <MenuItem
          sx={{ margin: '0em 1em', borderRadius: '8px' }}
          component={Link}
          to="/adminpanel"
        >
          <ListItemIcon>
            <SettingsSuggestTwoToneIcon
              sx={{ width: '1.2em', height: '1.2em' }}
            />
          </ListItemIcon>
          Admin Panel
        </MenuItem>
      )}

      {/* )} */}
      <Divider />
      <Box sx={{ margin: '9px' }}>
        <Button
          onClick={() => dispatch(logout())}
          fullWidth
          color="secondary"
          startIcon={<LockOpenTwoToneIcon />}
        >
          Sign out
        </Button>
      </Box>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleOpenNotification}>
        <IconButton aria-label="show 17 new notifications" color="inherit">
          <NotificationButton
            teamId={userData?.team_id}
            userId={userData?.id}
            defaultValue={unread}
          />
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem component={Link} to="/support">
        <IconButton aria-label="help center" color="inherit">
          <ContactSupportTwoToneIcon />
        </IconButton>
        <p>Contact Support</p>
      </MenuItem>
      <MenuItem component={Link} to="/profile">
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: 99 }} elevation={0}>
        <Box px={2} overflow="hidden">
          <Toolbar
            disableGutters
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                component={Link}
                to={'/dashboard'}
                sx={{
                  height: '40px',
                  width: '82px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '14px',
                  background:
                    'linear-gradient(135deg, rgba(124,58,237,.28), rgba(255,255,255,.04))',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.08)',
                }}
              >
                <img
                  src={logo}
                  alt="ad-weave-logo"
                  style={{ height: 'auto', width: '56px' }}
                />
              </Box>

              <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                  }}
                >
                  {(userData?.is_smartly ? smartlyPages : adweavePages).map(
                    (page) => (
                      <MenuItem
                        key={page?.name}
                        onClick={handleCloseNavMenu}
                        component={Link}
                        to={page?.url}
                        target={
                          page?.name.toLowerCase().includes('brief')
                            ? '_blank'
                            : '_self'
                        }
                        rel="noopener noreferrer"
                      >
                        <Typography textAlign="center">{page?.name}</Typography>
                      </MenuItem>
                    )
                  )}
                </Menu>
              </Box>
              <List
                component={Box}
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  position: 'relative',
                  margin: 0,
                  padding: 0,
                  listStyle: 'none',
                }}
              >
                {(userData?.team_id == 11
                  ? ticketPages
                  : userData?.is_smartly
                  ? smartlyPages
                  : adweavePages
                ).map((page, index) => (
                  <ListItem disablePadding key={index}>
                    <ListItemButton
                      selected={
                        !_.isNull(
                          matchPath(page?.url, `/${pathname.split('/')[1]}`)
                        ) &&
                        matchPath(page?.url, `/${pathname.split('/')[1]}`)
                          .isExact
                      }
                      disableTouchRipple
                      disableRipple
                      onClick={handleCloseNavMenu}
                      component={Link}
                      to={`${page?.url.toLowerCase()}`}
                      target={
                        page?.name.toLowerCase().includes('brief')
                          ? '_blank'
                          : '_self'
                      }
                      rel="noopener noreferrer"
                      id="nav-button"
                    >
                      <ListItemText
                        primaryTypographyProps={{
                          color: '#fff',
                          className: 'nav-label',
                          fontSize: '13px',
                          fontWeight: 700,
                        }}
                        primary={page?.name}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              {/*
                  <Tooltip
                    title="Task Timer"
                    componentsProps={{
                      tooltip: {
                        sx: {
                          lineHeight: 'normal',
                          marginTop: '0.4em !important',
                        },
                      },
                    }}
                    arrow
                  >
                    <Button
                      color="secondary"
                      variant="contained"
                      startIcon={<TimerTwoToneIcon />}
                      sx={{
                        textTransform: 'capitalize',
                        fontWeight: 800,
                        fontSize: '0.8em',
                        padding: '10px 17px 10px 15px',
                      }}
                      size="small"
                      onClick={handleOpenPreset}
                    >
                      Task Timer
                    </Button> */}
              {/* <Stack
                    direction="row"
                    alignItems="center"
                    sx={{
                      fontWeight: 700,
                      padding: '0 17px 0 12px',
                      backgroundColor: '#7e14e6',
                      borderRadius: 1,
                    }}
                  >
                    <IconButton
                      aria-label="show 4 new mails"
                      color="inherit"
                      onClick={handleOpenPreset}
                    >
                      <TimerTwoToneIcon />
                    </IconButton>
                    <Typography variant="span">Task Timer</Typography>
                  </Stack> */}
              {/* </Tooltip> */}
              <Tooltip
                title="Search"
                componentsProps={{
                  tooltip: {
                    sx: {
                      lineHeight: 'normal',
                      marginTop: '0.4em !important',
                    },
                  },
                }}
                arrow
              >
                <IconButton
                  aria-label="show 4 new mails"
                  color="inherit"
                  onClick={handleOpenSearch}
                  sx={{
                    padding: '7px 9px',
                    borderRadius: '8px',
                    backgroundColor: openSearch
                      ? 'rgba(124, 58, 237, 0.85)'
                      : 'transparent',
                    ':hover': {
                      backgroundColor: 'rgba(124, 58, 237, 0.32)',
                    },
                  }}
                >
                  <SearchTwoToneIcon />
                </IconButton>
              </Tooltip>
              {!userData.is_smartly && (
                <Tooltip
                  title="Task Timer"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        lineHeight: 'normal',
                        marginTop: '0.4em !important',
                      },
                    },
                  }}
                  arrow
                >
                  <IconButton
                    aria-label="show 4 new mails"
                    color="inherit"
                    onClick={handleOpenPreset}
                    sx={{
                      padding: '7px 9px',
                      borderRadius: '8px',
                      backgroundColor: openPreset
                        ? 'rgba(124, 58, 237, 0.85)'
                        : 'transparent',
                      ':hover': {
                        backgroundColor: 'rgba(124, 58, 237, 0.32)',
                      },
                    }}
                  >
                    <TimerTwoToneIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip
                title="Notifications"
                componentsProps={{
                  tooltip: {
                    sx: {
                      lineHeight: 'normal',
                      marginTop: '0.4em !important',
                    },
                  },
                }}
                arrow
              >
                <IconButton
                  aria-label="show 17 new notifications"
                  color="inherit"
                  sx={{
                    margin: '0 0.2em',
                    padding: '7px 9px',
                    borderRadius: '8px',
                    backgroundColor: openNotification
                      ? 'rgba(124, 58, 237, 0.85)'
                      : 'transparent',
                    ':hover': {
                      backgroundColor: 'rgba(124, 58, 237, 0.32)',
                    },
                  }}
                  onClick={handleOpenNotification}
                >
                  <NotificationButton
                    teamId={userData?.team_id}
                    userId={userData?.id}
                    defaultValue={unread}
                  />
                </IconButton>
              </Tooltip>
              {!userData.is_smartly && (
                <>
                  <Tooltip
                    title="Support"
                    componentsProps={{
                      tooltip: {
                        sx: {
                          lineHeight: 'normal',
                          marginTop: '0.4em !important',
                        },
                      },
                    }}
                    arrow
                  >
                    <IconButton
                      aria-label="show 4 new mails"
                      color="inherit"
                      component={Link}
                      to={'/support'}
                      sx={{
                        padding: '7px 9px',
                        borderRadius: '8px',
                        backgroundColor: pathname?.includes('support')
                          ? 'rgba(124, 58, 237, 0.85)'
                          : 'transparent',
                        ':hover': {
                          backgroundColor: 'rgba(124, 58, 237, 0.32)',
                        },
                      }}
                    >
                      <ContactSupportTwoToneIcon />
                    </IconButton>
                  </Tooltip>
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                      margin: '0 0.3em 0 0.23em',
                      borderColor: '#ffffff30',
                    }}
                  />
                  <Tooltip
                    title="Create a new task"
                    componentsProps={{
                      tooltip: {
                        sx: {
                          lineHeight: 'normal',
                          marginTop: '0.4em !important',
                        },
                      },
                    }}
                    arrow
                  >
                    <Button
                      color="secondary"
                      variant="contained"
                      startIcon={<AddTwoToneIcon />}
                      sx={{
                        textTransform: 'capitalize',
                        fontWeight: 700,
                        padding: '7px 13px 7px 11px',
                        borderRadius: '6px',
                      }}
                      size="small"
                      onClick={handleTaskCreation}
                    >
                      New Task
                    </Button>
                  </Tooltip>
                </>
              )}
              <Divider
                orientation="vertical"
                flexItem
                sx={{ margin: '0 0.5em 0 0.3em', borderColor: '#ffffff30' }}
              />
              <Button
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                sx={{
                  backgroundColor: [
                    '/profile',
                    '/users',
                    '/partners',
                    // '/timesheet',
                  ].includes(pathname)
                    ? 'rgba(124, 58, 237, 0.22)'
                    : 'transparent',
                  ':hover': {
                    backgroundColor: 'rgba(124, 58, 237, 0.18)',
                  },
                }}
              >
                <Avatar
                  {...stringAvatar(userData?.fullname, {
                    width: 30,
                    height: 30,
                    fontSize: '14px',
                    border: '1px solid #ffffff9c',
                  })}
                  src={userData?.profile_picture}
                />
                <Box>
                  <Box
                    sx={{
                      paddingLeft: '9px',
                      textAlign: 'left',
                      width: '130px',
                    }}
                  >
                    <Typography
                      variant="body1"
                      color="#9ea4c1"
                      fontWeight={800}
                      fontSize={12}
                      noWrap
                    >
                      {userData?.fullname}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="#9ea4c199"
                      fontSize={10}
                      noWrap
                    >
                      {userData?.team_name}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'inline-flex' }}>
                  <KeyboardArrowDownTwoToneIcon
                    sx={{
                      fontSize: '1.5rem',
                      marginLeft: '9px',
                      color: '#9ea4c1',
                    }}
                  />
                </Box>
              </Button>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Box>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </>
  );
}

export default Main;

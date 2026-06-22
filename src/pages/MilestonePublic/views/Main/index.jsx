import { useContext } from 'react';
import {
  AppBar,
  Box,
  Stack,
  Typography,
  Divider,
  Tooltip,
  styled,
  TextField,
  Autocomplete,
} from '@mui/material';
import {
  googleDisplay,
  googleVideo,
  metaStatic,
  metaVideo,
  youtubeVideo,
} from 'pages/ConceptOverview/constant';
import Milestone from 'pages/ConceptOverview/views/Milestone';
import CampaignMilestone from 'pages/Campaign/views/Milestone';
import logo from 'assets/smartly/logo-initial-white.svg';
import moment from 'moment-timezone';
import ConceptOverviewContext from 'pages/ConceptOverview/context';
import CampaignOverviewContext from 'pages/Campaign/context';
import { useLocation } from 'react-router-dom';

const StyledTypography = styled(Typography)({
  lineHeight: 'normal',
  cursor: 'default',
});

const StyledTextField = styled(TextField)({
  fontSize: '0.8em',
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#5025c4',
    },
  },
});

const StyledAutocomplete = styled(Autocomplete)({
  width: 'auto',
  '&.MuiListSubheader-root': {
    color: 'rgb(242 32 118)',
    lineHeight: '32px',
    backgroundColor: '#f0f0f0',
  },
  '& .MuiAutocomplete-inputRoot .Mui-disabled ': {
    WebkitTextFillColor: 'rgba(0, 0, 0, 0.8)',
  },
  flex: 1,
});

function Main() {
  const { pathname } = useLocation();

  const { milestone, timeZone, setTimeZone } = useContext(
    !pathname.includes('campaign')
      ? ConceptOverviewContext
      : CampaignOverviewContext
  );

  return (
    <Box
      sx={{
        height: '100vh',
        overflowY: 'scroll',
        backgroundColor: '#f2f5f9',
        lineHeight: 'normal',
      }}
    >
      <AppBar sx={{ zIndex: 99 }} elevation={0}>
        <Stack
          spacing={2}
          direction="row"
          alignItems="center"
          sx={{ height: '50px', ml: '1.5em' }}
        >
          <img src={logo} alt="ad-weave-logo" style={{ width: '50px' }} />
          <Typography sx={{ color: 'white', fontSize: '13px' }}>
            Milestone
          </Typography>
        </Stack>
      </AppBar>
      <Box sx={{ mt: '70px' }}>
        <Stack sx={{ marginLeft: '20px' }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ height: '2em' }}
          >
            <StyledTypography
              className="header__title--overlay"
              variant="h6"
              fontWeight={800}
              color="primary"
              noWrap
            >
              {milestone.templates.header?.name}
            </StyledTypography>
            <Box
              display="flex"
              alignItems="center"
              mr={2}
              sx={{ width: '18em' }}
            >
              <StyledAutocomplete
                disablePortal
                disableClearable
                value={timeZone}
                fullWidth
                options={moment.tz.names()}
                onChange={(_, value) => {
                  setTimeZone(value);
                }}
                renderInput={(params) => (
                  <StyledTextField
                    {...params}
                    size="small"
                    label="Time Zone"
                    placeholder={'Select Time Zone'}
                    InputLabelProps={{
                      ...params.InputLabelProps,
                      style: { fontSize: '1.1em' },
                    }}
                  />
                )}
              />
            </Box>
          </Stack>
          <Stack direction="row" alignItems="center">
            <Box>
              <Tooltip
                title="Date Created"
                componentsProps={{
                  tooltip: {
                    sx: { lineHeight: 'normal', margin: '0 !important' },
                  },
                }}
              >
                <StyledTypography variant="caption" noWrap>
                  {moment(
                    !pathname.includes('campaign')
                      ? milestone.templates.header?.created_at
                      : milestone.templates.header?.date_created
                  )
                    .tz(timeZone)
                    .format('LLL')}
                </StyledTypography>
              </Tooltip>
            </Box>
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{ margin: '0 0.4em' }}
            />
            <Box>
              <Tooltip
                title="Partner Group"
                componentsProps={{
                  tooltip: {
                    sx: { lineHeight: 'normal', margin: '0 !important' },
                  },
                }}
              >
                <StyledTypography
                  variant="caption"
                  color="secondary"
                  sx={{
                    cursor: 'pointer',
                    ':hover': { color: '#f22176' },
                  }}
                >
                  {milestone.templates.header?.partner_name}
                </StyledTypography>
              </Tooltip>
            </Box>
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{ margin: '0 0.4em' }}
            />
            <Box display="flex" alignItems="center">
              {milestone.templates?.header?.channel?.google?.display && (
                <>
                  <Tooltip
                    title="Google Display"
                    componentsProps={{
                      tooltip: {
                        sx: { lineHeight: 'normal', margin: '0 !important' },
                      },
                    }}
                  >
                    {googleDisplay}
                  </Tooltip>
                  {(milestone.templates?.header?.channel?.google?.video ||
                    milestone.templates?.header?.channel?.facebook?.static ||
                    milestone.templates?.header?.channel?.facebook?.video ||
                    milestone.templates?.header?.channel?.youtube?.video) && (
                    <Divider
                      orientation="vertical"
                      variant="middle"
                      flexItem
                      sx={{ margin: '0 0.4em' }}
                    />
                  )}
                </>
              )}

              {milestone.templates?.header?.channel?.google?.video && (
                <>
                  <Tooltip
                    title="Google Video"
                    componentsProps={{
                      tooltip: {
                        sx: { lineHeight: 'normal', margin: '0 !important' },
                      },
                    }}
                  >
                    {googleVideo}
                  </Tooltip>
                  {(milestone.templates?.header?.channel?.facebook?.static ||
                    milestone.templates?.header?.channel?.facebook?.video ||
                    milestone.templates?.header?.channel?.youtube?.video) && (
                    <Divider
                      orientation="vertical"
                      variant="middle"
                      flexItem
                      sx={{ margin: '0 0.4em' }}
                    />
                  )}
                </>
              )}

              {milestone.templates?.header?.channel?.facebook?.static && (
                <>
                  <Tooltip
                    title="Meta Static"
                    componentsProps={{
                      tooltip: {
                        sx: { lineHeight: 'normal', margin: '0 !important' },
                      },
                    }}
                  >
                    {metaStatic}
                  </Tooltip>
                  {(milestone.templates?.header?.channel?.facebook?.video ||
                    milestone.templates?.header?.channel?.youtube?.video) && (
                    <Divider
                      orientation="vertical"
                      variant="middle"
                      flexItem
                      sx={{ margin: '0 0.4em' }}
                    />
                  )}
                </>
              )}

              {milestone.templates?.header?.channel?.facebook?.video && (
                <>
                  <Tooltip
                    title="Meta Video"
                    componentsProps={{
                      tooltip: {
                        sx: { lineHeight: 'normal', margin: '0 !important' },
                      },
                    }}
                  >
                    {metaVideo}
                  </Tooltip>
                  {milestone.templates?.header?.channel?.youtube?.video && (
                    <Divider
                      orientation="vertical"
                      variant="middle"
                      flexItem
                      sx={{ margin: '0 0.4em' }}
                    />
                  )}
                </>
              )}

              {milestone.templates?.header?.channel?.youtube?.video && (
                <Tooltip
                  title="Youtube"
                  componentsProps={{
                    tooltip: {
                      sx: { lineHeight: 'normal', margin: '0 !important' },
                    },
                  }}
                >
                  {youtubeVideo}
                </Tooltip>
              )}
            </Box>
          </Stack>
        </Stack>
        {!pathname.includes('campaign') ? (
          <Milestone isPublic={true} />
        ) : (
          <CampaignMilestone isPublic={true} />
        )}
      </Box>
    </Box>
  );
}

export default Main;

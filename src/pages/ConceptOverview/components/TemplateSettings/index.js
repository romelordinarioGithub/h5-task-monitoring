import {
  Box,
  Autocomplete,
  TextField,
  Stack,
  styled,
  Typography,
  Button,
  Divider,
  IconButton,
} from '@mui/material';
import _ from 'lodash';

import ClearIcon from '@mui/icons-material/Clear';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';

import PropTypes from 'prop-types';

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

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#5025c4',
    },
  },
});

const StyledTypography = styled(Typography)({
  lineHeight: 'normal',
  cursor: 'default',
});

function TemplateSettings({
  region,
  holidays,
  regionData,
  handleChangeRegion,
  handlePopover,
}) {
  return (
    <Box mt={2}>
      <Stack maxWidth={300} spacing={3}>
        <Stack spacing={2}>
          <StyledAutocomplete
            disablePortal
            value={region}
            getOptionLabel={(option) => option.name || ''}
            options={regionData}
            onChange={(_, value) => {
              handleChangeRegion(value);
            }}
            renderInput={(params) => (
              <StyledTextField
                {...params}
                size="small"
                label="Region"
                placeholder={'Select Region'}
              />
            )}
          />
          <Box>
            <StyledTypography fontWeight="bold" mb={1}>
              Non-Working Dates
            </StyledTypography>
            <StyledTypography>
              Specify holidays or one-off dates when your team won&apos;t be
              working.
            </StyledTypography>
          </Box>
          <Box>
            <Stack spacing={3}>
              {!_.isEmpty(holidays) && (
                <Box>
                  <StyledTypography variant="caption">Dates</StyledTypography>
                  {holidays.map((data, index) => (
                    <Box key={index} mt={1}>
                      <Stack direction="row" justifyContent="space-between">
                        <Box>
                          <Typography fontSize="1em">{data.date}</Typography>
                        </Box>
                        <Box>
                          <IconButton size="small">
                            <EditCalendarIcon />
                          </IconButton>
                          <IconButton size="small">
                            <ClearIcon />
                          </IconButton>
                        </Box>
                      </Stack>
                      <Divider />
                    </Box>
                  ))}
                </Box>
              )}
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={(e) =>
                  handlePopover(e, 'holiday_add', null, null, null)
                }
              >
                Add Date
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}

TemplateSettings.propTypes = {
  region: PropTypes.any,
  holidays: PropTypes.array,
  regionData: PropTypes.any,
  handleChangeRegion: PropTypes.func,
  handlePopover: PropTypes.func,
};

export default TemplateSettings;

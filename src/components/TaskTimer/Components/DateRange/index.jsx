// MUI Components
import { Stack } from '@mui/material';
import GlobalPopper from 'components/Common/Popper';
import { DateRange } from 'react-date-range';
import PropTypes from 'prop-types';
import Color from 'color';
import theme from 'theme';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; //

const DateRangePopper = ({
  isOpen,
  anchorEl,
  onClose,
  selectedDates,
  handleOnChange,
}) => (
  <GlobalPopper
    isOpen={isOpen}
    anchorEl={anchorEl}
    onClose={onClose}
    placement={'bottom'}
    sx={{ zIndex: 1 }}
    content={
      <Stack>
        <DateRange
          ranges={selectedDates}
          rangeColors={[
            Color(theme.palette.secondary.main).alpha(0.8).string(),
          ]}
          months={1}
          direction="horizontal"
          onChange={(ranges) => handleOnChange(ranges)}
        />
      </Stack>
    }
  />
);

DateRangePopper.propTypes = {
  isOpen: PropTypes.any,
  placement: PropTypes.any,
  anchorEl: PropTypes.any,
  onClose: PropTypes.any,
  onChange: PropTypes.any,
  selectedDates: PropTypes.any,
  handleOnChange: PropTypes.any,
  handleReset: PropTypes.any,
  handleApply: PropTypes.any,
};

export default DateRangePopper;

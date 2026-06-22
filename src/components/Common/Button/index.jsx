// MUI
import { styled } from '@mui/styles';
import LoadingButton from '@mui/lab/LoadingButton';
// Utilities
import PropTypes from 'prop-types';

const StyledButton = styled(LoadingButton)(({ variant }) => ({
  marginTop: variant ? '0.5rem' : 0,
  marginBottom: variant ? '0.5rem' : 0,
  padding: variant ? '0.6em 1.4em' : 0,
  borderRadius: '8px',
  fontSize: '0.86rem',
  fontWeight: 700,
  textTransform: 'none',
  boxShadow:
    variant === 'contained'
      ? '0 10px 30px -20px rgba(124, 58, 237, 0.35)'
      : 'none',
  transition:
    'background-color 160ms ease, box-shadow 160ms ease, transform 160ms ease',
  '&:hover': {
    transform: variant === 'contained' ? 'translateY(-1px)' : 'none',
    boxShadow:
      variant === 'contained'
        ? '0 14px 32px -22px rgba(124, 58, 237, 0.45)'
        : 'none',
  },
}));

const Button = ({ className, children, ...props }) => {
  return (
    <StyledButton disableElevation={true} className={className} {...props}>
      {children}
    </StyledButton>
  );
};

Button.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    ),
    PropTypes.element,
    PropTypes.string,
  ]),
  variant: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;

import makeStyles from '@mui/styles/makeStyles';
import { designTokens, sidebarWidth } from 'theme/variables';

const useStyles = makeStyles((theme) => ({
  sidebarContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 4,
  },
  sidebar: {
    width: sidebarWidth,
    height: '100vh',
    backgroundColor: designTokens.colors.navy,
    borderRadius: 0,
    overflow: 'hidden',
    padding: '1em 0',
    borderRight: `1px solid ${designTokens.colors.navyBorder}`,
    boxShadow: '10px 0 30px rgba(9, 11, 29, 0.18)',
  },
  logoContainer: {
    width: '100%',
    height: 'auto',
    textAlign: 'center',
    padding: '0.2em 0.45em 0.8em',
  },
  logoSize: {
    height: 'auto',
    width: '-webkit-fill-available',
  },
  list: {
    height: 'calc(100% - 1.2em)',
    paddingTop: '12px',
  },
  nav: {
    height: '-webkit-fill-available',
  },
  avatar: {
    width: '35px',
    height: '35px',
  },
  items: {
    color: '#fff',
  },
  avatarItems: {
    display: 'flex',
    justifyContent: 'center',
  },
  sidebarItem: {
    width: 'auto',
    height: 'auto',
    borderRadius: designTokens.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0.35em 0.25em',
    '&:hover': {
      backgroundColor: 'rgba(124, 58, 237, 0.18)',
      opacity: 1,
    },
  },
  staticItem: {
    width: 'auto',
    height: 'auto',
    borderRadius: designTokens.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0.35em 0.25em',
    '&:hover': {
      backgroundColor: 'rgba(124, 58, 237, 0.18)',
      opacity: 1,
    },
  },
  sidebarItemAvatar: {
    padding: 0,
    borderRadius: '2em',
    border: '2px solid #fff',
    width: 'fit-content',
    marginTop: '2em',
  },
  active: {
    backgroundColor: designTokens.colors.purple,
    opacity: 1,
    color: '#fff',
    boxShadow: '0 8px 18px rgba(124, 58, 237, 0.32)',
    '&:hover': {
      backgroundColor: designTokens.colors.purple,
    },
  },
  activeAvatar: {
    border: '2px solid',
    borderColor: theme.palette.secondary.main,
  },
  iconContainer: {
    minWidth: 'inherit',
    color: 'rgba(255,255,255,.72)',
  },
  staticIconContainer: {
    minWidth: 'inherit',
    color: 'rgba(255,255,255,.72)',
  },
  icon: {
    width: '24px',
    height: '24px',
  },
  grid: {
    width: '100%',
    padding: '0.3em',
  },
  drawer: {
    zIndex: 3,
  },
  popper: {
    left: '0.5em !important',
    zIndex: 3,
  },
}));

export { useStyles };

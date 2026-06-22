import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles(() => ({
  root: {
    height: '100vh',
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
  },
  content: {
    height: 'calc(100% - 7em)',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  drawer: {
    zIndex: 99,
  },
}));

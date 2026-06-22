import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles(() => ({
  overflowHiddenX: {
    overflow: 'hidden',
    backgroundColor: '#f7f8fc',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2em 0 2em 50px',
  },
  paper: {
    backgroundColor: 'white',
    width: '75%',
    minHeight: '-webkit-fill-available',
    maxHeight: '90vh',
    boxShadow: '0 35px 80px -35px rgba(92, 33, 180, 0.35)',
    borderRadius: '26px',
    border: '1px solid rgba(229, 231, 235, 0.75)',
    overflow: 'auto',
  },
}));

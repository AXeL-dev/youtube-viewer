import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'row',
      height: '100vh',
    },
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
  })
);

export default useStyles;

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      boxShadow: 'none',
      borderBottom: '1px solid #e8e8e8',
      borderRadius: 0,
    },
    header: {
      padding: theme.spacing(2.5, 1, 2.5, 0),
    },
    avatar: {
      backgroundColor: red[500],
      width: theme.spacing(7.5),
      height: theme.spacing(7.5),
    },
  })
);

export default useStyles;

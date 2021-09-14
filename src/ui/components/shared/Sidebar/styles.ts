import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      minWidth: 280,
      backgroundColor: '#fafafa',
      borderRight: '1px solid #e8e8e8',
    },
    body: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(2.5, 0, 2.5, 3),
    },
    title: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing(6),
    },
    list: {
      flexGrow: 1,
      paddingLeft: theme.spacing(1),
      width: '100%',
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(2, 3),
      borderTop: '1px solid #e8e8e8',
    },
  })
);

export default useStyles;

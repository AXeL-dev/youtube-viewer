import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
    },
    heartIcon: {
      color: '#e1495c',
      fontSize: 16,
      verticalAlign: 'middle',
    },
    githubIcon: {
      padding: 0,
    },
  })
);

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    channelsOptionsIcon: {
      top: '50%',
      right: '16px',
      position: 'absolute',
      transform: 'translateY(-50%)',
    },
    menuIcon: {
      fontSize: 20,
      marginRight: theme.spacing(1),
      verticalAlign: 'middle',
    },
    subheader: {
      position: 'relative',
    }
  }),
);

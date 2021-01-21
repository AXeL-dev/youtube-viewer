import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      width: '100%',
      height: '80%',
      justifyContent: 'center',
      '&.expanded': {
        height: '100%',
      },
    },
    centered: {
      alignSelf: 'center',
      textAlign: 'center',
    },
  }),
);

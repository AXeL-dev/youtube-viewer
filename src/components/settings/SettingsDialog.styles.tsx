import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    settingsAppBar: {
      position: 'relative',
      backgroundColor: '#f44336',
    },
    settingsTitle: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    container: {
      width: '223px',
      height: '40px',
    },
    select: {
      padding: '10px 26px 10px 12px',
      '&:-moz-focusring': { // removes the ugly dotted outline around the selected option in Firefox
        color: 'transparent',
        textShadow: '0 0 0 #000',
      },
    },
    optionLabel: {
      maxWidth: '70%',
    },
  }),
);

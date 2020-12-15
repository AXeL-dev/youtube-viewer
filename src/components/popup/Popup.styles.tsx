import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { isWebExtension, isFirefox } from '../../helpers/browser';

const drawerWidth = 240;

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      minWidth: '700px',
      minHeight: isWebExtension() ? '500px' : '100vh',
      maxHeight: isWebExtension() ? '500px' : 'none',
      maxWidth: isWebExtension() && isFirefox() ? '700px' : 'none',
    },
    appBar: {
      backgroundColor: '#f44336',
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
    },
    grow: {
      flexGrow: 1,
    },
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      //padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
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
    heartIcon: {
      color: '#e25555',
      fontSize: 16,
      verticalAlign: 'middle',
    },
    madeWithLove: {
      padding: theme.spacing(1, 0),
    },
  }),
);

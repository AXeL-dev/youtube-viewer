import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Divider from '@material-ui/core/Divider';
import Slide from '@material-ui/core/Slide';
import Switch from '@material-ui/core/Switch';
import { TransitionProps } from '@material-ui/core/transitions';
import { Settings } from '../../models/Settings';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    settingsAppBar: {
      position: 'relative',
      backgroundColor: '#f44336',
    },
    settingsTitle: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
  }),
);

const settingsDialogTransition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface SettingsDialogProps {
  settings: Settings;
  open: boolean;
  onClose: Function;
  onSave: Function;
}

export function SettingsDialog(props: SettingsDialogProps) {
  const { settings, open, onClose, onSave } = props;
  const classes = useStyles();

  const validateSettings = (event: any) => {
    let input = event.target;
    //console.log(input.type, input.min, input.max, input.value);
    if (input.type === "number") {
      if (!input.value.match(/^\d+$/) || +input.value < +input.min) {
        input.value = input.min;
      } else if (+input.value > +input.max) {
        input.value = input.max;
      }
    }
  };

  return (
    <Dialog fullScreen open={open} onClose={() => onClose()} TransitionComponent={settingsDialogTransition}>
      <AppBar color="secondary" className={classes.settingsAppBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => onClose()} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.settingsTitle}>
            Settings
          </Typography>
          <Button autoFocus color="inherit" onClick={() => onSave()}>
            save
          </Button>
        </Toolbar>
      </AppBar>
      <List>
        <ListItem>
          <ListItemText primary="Max videos per channel" secondary="The maximum number of videos to show per channel" />
          <ListItemSecondaryAction>
            <TextField
              id="videosPerChannel"
              type="number"
              size="small"
              variant="outlined"
              color="secondary"
              inputProps={{ min: 1, max: 50, step: 3 }}
              defaultValue={settings?.videosPerChannel}
              onChange={(event) => validateSettings(event)}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary="Anteriority of videos (in days)" secondary="Number of days to subtract from the current date" />
          <ListItemSecondaryAction>
            <TextField
              id="videosAnteriority"
              type="number"
              size="small"
              variant="outlined"
              color="secondary"
              inputProps={{ min: 1, max: 365, step: 7 }}
              defaultValue={settings?.videosAnteriority}
              onChange={(event) => validateSettings(event)}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary="Custom API key" secondary={
            <React.Fragment>
              <Typography variant="body2" component="span">Replaces the default youtube API key provided with the extension</Typography>
              <br/>
              <Typography variant="body2" component="span">(will apply the next time you open the extension popup)</Typography>
            </React.Fragment>
          } />
          <ListItemSecondaryAction>
            <TextField
              id="apiKey"
              type="text"
              placeholder="AIzaSyDOkg-u9jnhP-WnzX5WPJyV1sc5QQrtuyc"
              size="small"
              variant="outlined"
              color="secondary"
              inputProps={{ minLength: 39 }}
              defaultValue={settings?.apiKey}
              onChange={(event) => validateSettings(event)}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary="Clear videos cache on close" secondary="Cache may speed up loading time & reduce API quota consumption" />
          <ListItemSecondaryAction>
            <Switch
              id="clearCacheOnClose"
              defaultChecked={settings?.clearCacheOnClose}
              color="secondary"
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </Dialog>
  )
}

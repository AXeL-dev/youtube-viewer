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
import Select from '@material-ui/core/Select';
import Link from '@material-ui/core/Link';
import { TransitionProps } from '@material-ui/core/transitions';
import { Settings } from '../../models/Settings';
import { ChannelSelection } from '../../models/Channel';

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
          <ListItemText primary="Default channel selection" secondary="The channel menu that would be selected by default" className={classes.optionLabel} />
          <ListItemSecondaryAction>
            <Select
              native
              inputProps={{ id: 'defaultChannelSelection', className: classes.select }}
              variant="outlined"
              color="secondary"
              className={classes.container}
              defaultValue={settings?.defaultChannelSelection}
            >
              <option value={ChannelSelection.All}>All</option>
              <option value={ChannelSelection.TodaysVideos}>Today's videos</option>
              <option value={ChannelSelection.RecentVideos}>Recent videos</option>
            </Select>
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary="Max videos per channel" secondary="The maximum number of videos to show per channel" className={classes.optionLabel} />
          <ListItemSecondaryAction>
            <TextField
              id="videosPerChannel"
              type="number"
              size="small"
              variant="outlined"
              color="secondary"
              inputProps={{ min: 1, max: 50, step: 3 }}
              className={classes.container}
              defaultValue={settings?.videosPerChannel}
              onChange={(event) => validateSettings(event)}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary="Anteriority of videos (in days)" secondary="Number of days to subtract from the current date" className={classes.optionLabel} />
          <ListItemSecondaryAction>
            <TextField
              id="videosAnteriority"
              type="number"
              size="small"
              variant="outlined"
              color="secondary"
              inputProps={{ min: 1, max: 365, step: 7 }}
              className={classes.container}
              defaultValue={settings?.videosAnteriority}
              onChange={(event) => validateSettings(event)}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary="Sort videos by" secondary="Videos sorting criteria" className={classes.optionLabel} />
          <ListItemSecondaryAction>
            <Select
              native
              inputProps={{ id: 'sortVideosBy', className: classes.select }}
              variant="outlined"
              color="secondary"
              className={classes.container}
              defaultValue={settings?.sortVideosBy}
            >
              <option value="date">Date</option>
              <option value="views">Views</option>
            </Select>
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary={
            <Typography variant="body1" component="span">Custom API key (<Link href="https://www.slickremix.com/docs/get-api-key-for-youtube/" target="_blank" rel="noopener">How to get an API key?</Link>)</Typography>
          } secondary={
            <React.Fragment>
              <Typography variant="body2" component="span">Replaces the default youtube API key provided with the extension</Typography>
              <br/>
              <Typography variant="body2" component="span">(will apply the next time you open the extension popup)</Typography>
            </React.Fragment>
          } className={classes.optionLabel} />
          <ListItemSecondaryAction>
            <TextField
              id="apiKey"
              type="text"
              placeholder="AIzaSyDOkg-u9jnhP-WnzX5WPJyV1sc5QQrtuyc"
              size="small"
              variant="outlined"
              color="secondary"
              inputProps={{ minLength: 39 }}
              className={classes.container}
              defaultValue={settings?.apiKey}
              onChange={(event) => validateSettings(event)}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary="Auto videos check rate (in minutes)" secondary="Number of minutes to wait before auto-checking for recent videos" className={classes.optionLabel} />
          <ListItemSecondaryAction>
            <TextField
              id="autoVideosCheckRate"
              type="number"
              size="small"
              variant="outlined"
              color="secondary"
              inputProps={{ min: 5, max: 720, step: 5 }}
              className={classes.container}
              defaultValue={settings?.autoVideosCheckRate}
              onChange={(event) => validateSettings(event)}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary="Enable recent videos notifications" secondary="Notifies you when recent videos get posted" className={classes.optionLabel} />
          <ListItemSecondaryAction>
            <Switch
              id="enableRecentVideosNotifications"
              defaultChecked={settings?.enableRecentVideosNotifications}
              color="secondary"
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary="Auto play videos once opened" secondary="Auto-play permission should be granted for youtube.com" className={classes.optionLabel} />
          <ListItemSecondaryAction>
            <Switch
              id="autoPlayVideos"
              defaultChecked={settings?.autoPlayVideos}
              color="secondary"
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary="Open videos in inactive tabs" secondary="Will open videos in new tabs without losing focus of the current tab" className={classes.optionLabel} />
          <ListItemSecondaryAction>
            <Switch
              id="openVideosInInactiveTabs"
              defaultChecked={settings?.openVideosInInactiveTabs}
              color="secondary"
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary="Open channels on name click" secondary='Will open channels directly by clicking on their name in the "All" or "Recent videos" view' className={classes.optionLabel} />
          <ListItemSecondaryAction>
            <Switch
              id="openChannelsOnNameClick"
              defaultChecked={settings?.openChannelsOnNameClick}
              color="secondary"
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary="Auto clear videos cache" secondary="Cache may speed up loading time & reduce API quota consumption" className={classes.optionLabel} />
          <ListItemSecondaryAction>
            <Switch
              id="autoClearCache"
              defaultChecked={settings?.autoClearCache}
              color="secondary"
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </Dialog>
  )
}

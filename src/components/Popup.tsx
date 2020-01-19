import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';
import DeleteIcon from '@material-ui/icons/Delete';
import GitHubIcon from '@material-ui/icons/GitHub';
import Avatar from '@material-ui/core/Avatar';
import VideoList from './VideoList';
import SearchChannelInput from './channel/Search';
import { Channel } from '../models/Channel';
import { get_activities, get_video_info } from '../helpers/youtube';
import { Video } from '../models/Video';
import { DeleteChannelDialog } from './channel/Dialog';
import { getDateBefore } from '../helpers/utils';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
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
    white: {
      color: '#fff',
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
      padding: theme.spacing(3),
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
  }),
);

export default function Popup() {
  const classes = useStyles();
  const theme = useTheme();
  const [channels, setChannels] = React.useState<Channel[]>([]);
  const [videos, setVideos] = React.useState<Video[]>([]);
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [openDeleteChannelDialog, setOpenDeleteChannelDialog] = React.useState(false);
  const [selectedChannelIndex, setSelectedChannelIndex] = React.useState(0);
  const [channelToDelete, setChannelToDelete] = React.useState<Channel>();
  const [channelToDeleteIndex, setChannelToDeleteIndex] = React.useState(0);
  const aMonthAgoDate = getDateBefore(30);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const addChannel = (channel: Channel) => {
    //console.log('selected channel:', channel);
    setIsLoading(true);
    get_activities(channel.id, aMonthAgoDate).then((results) => {
      //console.log(results);
      if (results?.items) {
        const found: Channel | undefined = channels.find((c: Channel) => c.id === channel.id);
        if (!found) {
          setChannels([...channels, channel]);
          setSelectedChannelIndex(channels.length);
        } else {
          setSelectedChannelIndex(channels.indexOf(found));
        }
        const videoIds = results.items.map((item: any) => item.contentDetails.upload?.videoId);
        //console.log(videoIds);
        get_video_info(videoIds).then((videos?: Video[]) => {
          //console.log(videos);
          setVideos(videos || []);
          setIsLoading(false);
        });
      }
    }).catch((error) => {
      console.error(error);
    });
  };

  const selectChannel = (channel: Channel, index: number) => {
    //console.log('selected channel:', channel);
    setIsLoading(true);
    get_activities(channel.id, aMonthAgoDate).then((results) => {
      //console.log(results);
      if (results?.items) {
        setSelectedChannelIndex(index);
        const videoIds = results.items.map((item: any) => item.contentDetails.upload?.videoId);
        //console.log(videoIds);
        get_video_info(videoIds).then((videos?: Video[]) => {
          //console.log(videos);
          setVideos(videos || []);
          setIsLoading(false);
        });
      }
    }).catch((error) => {
      console.error(error);
    });
  };
  
  const deleteChannel = (event: any, channel: Channel, index: number) => {
    event.stopPropagation();
    setChannelToDelete(channel);
    setChannelToDeleteIndex(index);
    setOpenDeleteChannelDialog(true);
  };

  const confirmDeleteChannel = (index: number) => {
    setChannels(channels.filter((_, i) => i !== index));
    if (selectedChannelIndex === index) {
      setVideos([]);
    }
    closeDeleteChannelDialog();
  };

  const closeDeleteChannelDialog = () => {
    setOpenDeleteChannelDialog(false);
  };

  const showAllChannels = () => {
    setSelectedChannelIndex(-1);
    setIsLoading(true);
    setVideos([]);
    let promises: Promise<any>[] = [];
    let subPromises: Promise<any>[] = [];
    let videos: Video[]= [];
    channels.forEach((channel: Channel) => {
      const promise = get_activities(channel.id, aMonthAgoDate).then((results) => {
        //console.log(results);
        if (results?.items) {
          const videoIds = results.items.map((item: any) => item.contentDetails.upload?.videoId);
          //console.log(videoIds);
          const promise = get_video_info(videoIds).then((newVideos: Video[]) => {
            //console.log(channel.title, newVideos);
            videos.push(...newVideos);
          });
          subPromises.push(promise);
        }
      }).catch((error) => {
        console.error(error);
      });
      promises.push(promise);
    });
    Promise.all(promises).finally(() => {
      Promise.all(subPromises).finally(() => {
        setVideos(videos);
        setIsLoading(false);
      });
    });
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        color="secondary"
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            Youtube viewer
          </Typography>
          <SearchChannelInput onSelect={addChannel} />
          <div className={classes.grow} />
          <a href="https://github.com/AXeL-dev/youtube-viewer" target="_blank" rel="noopener noreferrer">
            <IconButton
              edge="end"
              aria-label="github link"
              color="inherit"
              className={classes.white}
            >
              <GitHubIcon />
            </IconButton>
          </a>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button key="all" selected={selectedChannelIndex === -1} onClick={() => showAllChannels()}>
            <ListItemIcon><SubscriptionsIcon /></ListItemIcon>
            <ListItemText primary="All" />
          </ListItem>
          {channels.map((channel: Channel, index: number) => (
            <ListItem button key={index} selected={index === selectedChannelIndex} onClick={() => selectChannel(channel, index)}>
              <ListItemIcon><Avatar alt={channel.title} src={channel.thumbnail} /></ListItemIcon>
              <ListItemText primary={channel.title} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={(event) => deleteChannel(event, channel, index)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <VideoList videos={videos} loading={isLoading} />
      </main>
      <DeleteChannelDialog
        open={openDeleteChannelDialog}
        channel={channelToDelete}
        index={channelToDeleteIndex}
        onConfirm={confirmDeleteChannel}
        onClose={closeDeleteChannelDialog}
      />
    </div>
  );
}

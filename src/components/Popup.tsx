import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import YoutubeSearchedForIcon from '@material-ui/icons/YoutubeSearchedFor';
import GitHubIcon from '@material-ui/icons/GitHub';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import VideoList from './video/VideoList';
import SearchChannelInput from './channel/SearchChannelInput';
import { Channel } from '../models/Channel';
import { getChannelActivities, getVideoInfo } from '../helpers/youtube';
import { Video } from '../models/Video';
import { getDateBefore } from '../helpers/utils';
import VideoGrid from './video/VideoGrid';
import { Settings } from '../models/Settings';
import { saveToStorage } from '../helpers/storage';
import { SettingsDialog } from './settings/SettingsDialog';
import { SettingsSnackbar } from './settings/SettingsSnackbar';
import { ChannelList } from './channel/ChannelList';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      minWidth: '700px',
      minHeight: '500px',
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
    container: {
      display: 'flex',
      width: '100%',
      height: '80vh',
      justifyContent: 'center',
    },
    centered: {
      alignSelf: 'center',
      textAlign: 'center',
      margin: '0 80px'
    },
  }),
);

// a little function to help us with reordering the dnd result
const reorder = (list: any, startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

interface PopupProps {
  channels: Channel[];
  settings: Settings;
}

export default function Popup(props: PopupProps) {
  const classes = useStyles();
  const theme = useTheme();
  const [channels, setChannels] = React.useState<Channel[]>(props.channels);
  const [videos, setVideos] = React.useState<Video[]>([]);
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedChannelIndex, setSelectedChannelIndex] = React.useState(-1);
  const [openSettingsDialog, setOpenSettingsDialog] = React.useState(false);
  const [settings, setSettings] = React.useState<Settings>(props.settings);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  let [cache, setCache] = React.useState<any>({});

  React.useEffect(() => setChannels(props.channels), [props.channels]);
  React.useEffect(() => setSettings(props.settings), [props.settings]);

  React.useEffect(() => {
    !videos.length && showAllChannels();
    saveToStorage({
      'channels': channels,
      'settings': settings
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channels, settings]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const getChannelVideos = (channel: Channel): Promise<Video[]> => {
    return new Promise((resolve, reject) => {
      //console.log('cache', cache);
      if (cache[channel.id]?.length) {
        //console.log('in cache', cache[channel.id]);
        resolve(cache[channel.id]);
      } else {
        getChannelActivities(channel.id, getDateBefore(settings.videosAnteriority)).then((results) => {
          //console.log(results);
          if (results?.items) {
            const videoIds = results.items.map((item: any) => item.contentDetails.upload?.videoId);
            //console.log(videoIds);
            getVideoInfo(videoIds, settings.videosPerChannel).then((videos?: Video[]) => {
              //console.log(videos);
              cache[channel.id] = videos;
              setCache(cache);
              resolve(videos || []);
            }).catch((error) => {
              console.error(error);
              resolve([]);
            });
          } else {
            resolve([]);
          }
        }).catch((error) => {
          console.error(error);
          resolve([]);
        });
      }
    });
  };

  const addChannel = (channel: Channel) => {
    // Add channel
    //console.log('selected channel:', channel);
    const found: Channel | undefined = channels.find((c: Channel) => c.id === channel.id);
    if (!found) {
      setChannels([...channels, channel]);
      setSelectedChannelIndex(channels.length);
    } else {
      setSelectedChannelIndex(channels.indexOf(found));
    }
    // Get channel videos
    setIsLoading(true);
    getChannelVideos(channel).then((videos: Video[]) => {
      setVideos(videos || []);
      setIsLoading(false);
    });
  };

  const selectChannel = (channel: Channel, index: number) => {
    // Select channel
    //console.log('selected channel:', channel);
    setSelectedChannelIndex(index);
    // Get its videos
    setIsLoading(true);
    getChannelVideos(channel).then((videos: Video[]) => {
      setVideos(videos || []);
      setIsLoading(false);
      window.scrollTo(0, 0); // scroll to top
    });
  };
  
  const deleteChannel = (index: number) => {
    setChannels(channels.filter((_, i) => i !== index));
    if (selectedChannelIndex === index) {
      setVideos([]);
    }
  };

  const showAllChannels = () => {
    // Select "All"
    setSelectedChannelIndex(-1);
    // Get all channels videos
    setIsLoading(true);
    setVideos([]);
    let promises: Promise<any>[] = [];
    let videos: Video[]= [];

    channels.forEach((channel: Channel) => {

      const promise = getChannelVideos(channel).then((newVideos: Video[]) => {
        //console.log(channel.title, newVideos);
        videos.push(...newVideos);
      });
      promises.push(promise);

    });

    Promise.all(promises).finally(() => {
      setVideos(videos);
      setIsLoading(false);
    });
  };

  const refreshChannels = (event: any) => {
    event.stopPropagation();
    cache = {};
    setCache(cache);
    showAllChannels();
  };

  const onChannelDragEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items: Channel[] = reorder(
      channels,
      result.source.index,
      result.destination.index
    ) as Channel[];

    //console.log(items);
    setChannels(items);
  };

  const openSettings = (event: any) => {
    event.stopPropagation();
    setOpenSettingsDialog(true);
  };

  const closeSettings = () => {
    setOpenSettingsDialog(false);
  };

  const saveSettings = () => {
    // Update settings
    setSettings({
      videosPerChannel: +(document.getElementById('videosPerChannel') as any).value,
      videosAnteriority: +(document.getElementById('videosAnteriority') as any).value,
      apiKey: (document.getElementById('apiKey') as any).value
    });
    closeSettings();
    setOpenSnackbar(true);
  };

  const closeSnackbar = () => {
    setOpenSnackbar(false);
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
          <Link href="https://github.com/AXeL-dev/youtube-viewer" target="_blank" rel="noopener">
            <IconButton
              edge="end"
              aria-label="github link"
              color="inherit"
              className={classes.white}
            >
              <GitHubIcon />
            </IconButton>
          </Link>
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
        <ChannelList
          channels={channels}
          selectedChannelIndex={selectedChannelIndex}
          onDragEnd={onChannelDragEnd}
          onOpenSettings={openSettings}
          onShowAll={showAllChannels}
          onRefresh={refreshChannels}
          onSelect={selectChannel}
          onDelete={deleteChannel}
        />
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
        //onClick={() => handleDrawerClose()}
      >
        <div className={classes.drawerHeader} />
        {channels?.length ? selectedChannelIndex === -1 ? (
          <VideoGrid channels={channels} videos={videos} loading={isLoading} maxPerChannel={settings.videosPerChannel} onSelect={selectChannel} />
        ) : (
          <VideoList videos={videos} loading={isLoading} maxPerChannel={settings.videosPerChannel} />
        ) : (
          <Box className={classes.container}>
            <Typography component="div" variant="h5" color="textSecondary" className={classes.centered} style={{ cursor: 'default' }}>
              <YoutubeSearchedForIcon style={{ fontSize: 38, verticalAlign: 'middle' }} /> Start by typing a channel name in the search box
            </Typography>
          </Box>
        )}
      </main>
      
      <SettingsDialog settings={settings} open={openSettingsDialog} onClose={closeSettings} onSave={saveSettings} />
      <SettingsSnackbar open={openSnackbar} onClose={closeSnackbar} onRefresh={refreshChannels} />
    </div>
  );
}

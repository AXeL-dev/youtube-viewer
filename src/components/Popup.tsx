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
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import SettingsIcon from '@material-ui/icons/Settings';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import GitHubIcon from '@material-ui/icons/GitHub';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Fade from '@material-ui/core/Fade';
import VideoList from './video/VideoList';
import SearchChannelInput from './channel/SearchChannelInput';
import { Channel } from '../models/Channel';
import { getChannelActivities, getVideoInfo } from '../helpers/youtube';
import { Video } from '../models/Video';
import { getDateBefore, memorySizeOf } from '../helpers/utils';
import VideoGrid from './video/VideoGrid';
import { Settings } from '../models/Settings';
import { saveToStorage } from '../helpers/storage';
import { ChannelList } from './channel/ChannelList';
import { MessageSnackbar } from './shared/MessageSnackbar';
import { SettingsDialog } from './settings/SettingsDialog';
import { SettingsSnackbar } from './settings/SettingsSnackbar';
import { debug } from '../helpers/debug';

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
      height: '80%',
      justifyContent: 'center',
    },
    centered: {
      alignSelf: 'center',
      textAlign: 'center',
      margin: '0 80px'
    },
    heartIcon: {
      color: '#e25555',
      fontSize: 16,
      verticalAlign: 'middle',
    },
    madeWithLove: {
      margin: theme.spacing(1, 0),
    },
  }),
);

interface PopupProps {
  channels: Channel[];
  settings: Settings;
  cache: any;
}

export default function Popup(props: PopupProps) {
  const classes = useStyles();
  const theme = useTheme();
  const [channels, setChannels] = React.useState<Channel[]>(props.channels);
  const [videos, setVideos] = React.useState<Video[]>([]);
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedChannelIndex, setSelectedChannelIndex] = React.useState(-1);
  const [settings, setSettings] = React.useState<Settings>(props.settings);
  const [openSettingsDialog, setOpenSettingsDialog] = React.useState(false);
  const [settingsSnackbarMessage, setSettingsSnackbarMessage] = React.useState('');
  const [lastError, setLastError] = React.useState<Error|null>(null);
  const [cache, setCache] = React.useState<any>({});

  React.useEffect(() => setChannels(props.channels), [props.channels]);
  React.useEffect(() => setSettings(props.settings), [props.settings]);
  React.useEffect(() => setCache(props.cache), [props.cache]);

  React.useEffect(() => {
    if (props.channels === channels && !videos.length) {
      showAllChannels(true);
    }
    saveToStorage({
      channels: channels,
      settings: settings
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channels, settings]);

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const displayError = (error: Error) => {
    console.error(error);
    setLastError(error);
  };

  const getChannelVideos = (channel: Channel, ignoreCache: boolean = false): Promise<Video[]> => {
    return new Promise((resolve, reject) => {
      if (!ignoreCache && cache[channel.id]?.length) {
        debug('load videos from cache', cache[channel.id]);
        resolve(cache[channel.id].slice(0, settings.videosPerChannel));
      } else {
        getChannelActivities(channel.id, getDateBefore(settings.videosAnteriority)).then((results) => {
          debug('activities', results);
          if (results?.items) {
            const cacheVideoIds = cache[channel.id]?.length ? cache[channel.id].map((video: Video) => video.id) : [];
            const videoIds = results.items.map((item: any) => item.contentDetails.upload?.videoId)
                                          .slice(0, settings.videosPerChannel)
                                          .filter((videoId: string) => cacheVideoIds.indexOf(videoId) === -1); // no need to refetch videos already in cache
            debug('getting videos', { videoIds: videoIds, cacheVideoIds: cacheVideoIds });
            getVideoInfo(videoIds).then((videos: Video[]) => {
              //console.log(videos);
              cache[channel.id] = cache[channel.id]?.length ? [...videos, ...cache[channel.id]].sort((a: Video, b: Video) => b.publishedAt - a.publishedAt) : videos;
              setCache(cache);
              saveToStorage({ cache: cache });
              resolve(cache[channel.id].slice(0, settings.videosPerChannel) || []);
            }).catch((error: Error) => {
              displayError(error);
              resolve([]);
            });
          } else {
            resolve([]);
          }
        }).catch((error: Error) => {
          displayError(error);
          resolve([]);
        });
      }
    });
  };

  const addChannel = (channel: Channel) => {
    // Add channel
    //debug('selected channel:', channel);
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
    //debug('selected channel:', channel);
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
      setSelectedChannelIndex(-2);
    }
  };

  const showAllChannels = (ignoreCache: boolean = false) => {
    // Select "All"
    setSelectedChannelIndex(-1);
    // Get all channels videos
    setIsLoading(true);
    setVideos([]);
    let promises: Promise<any>[] = [];
    let videos: Video[]= [];

    channels.forEach((channel: Channel) => {

      const promise = getChannelVideos(channel, ignoreCache).then((newVideos: Video[]) => {
        debug(channel.title, newVideos);
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
    showAllChannels(true);
  };

  const clearCache = () => {
    setCache({});
    saveToStorage({ cache: {} });
    setSettingsSnackbarMessage('Cache cleared!');
  };

  const getCacheSize = () => {
    const size = memorySizeOf(cache);
    //console.log(size);
    return size;
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
    setSettingsSnackbarMessage('Settings saved!');
  };

  const closeSettingsSnackbar = () => {
    setSettingsSnackbarMessage('');
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        color="secondary"
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: openDrawer,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, openDrawer && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            Youtube viewer
          </Typography>
          <SearchChannelInput onSelect={addChannel} onError={displayError} />
          <div className={classes.grow} />
          <IconButton edge="end" aria-label="settings" color="inherit" onClick={(event) => openSettings(event)}>
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={openDrawer}
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
          selectedIndex={selectedChannelIndex}
          onShowAll={showAllChannels}
          onRefresh={refreshChannels}
          onSelect={selectChannel}
          onDelete={deleteChannel}
          onSave={setChannels}
          onSelectedIndexChange={setSelectedChannelIndex}
          cacheSize={getCacheSize()}
          onClearCache={clearCache}
        />
        <div className={classes.grow} />
        <Divider />
        <Typography variant="caption" align="center" className={classes.madeWithLove}>
          Made with <FavoriteRoundedIcon className={classes.heartIcon} /> by AXeL
          <Link href="https://github.com/AXeL-dev/youtube-viewer" target="_blank" rel="noopener">
            <IconButton edge="end" size="small" aria-label="github link">
              <GitHubIcon fontSize="inherit" />
            </IconButton>
          </Link>
        </Typography>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: openDrawer,
        })}
        //onClick={() => handleDrawerClose()}
      >
        <div className={classes.drawerHeader} />
        {channels?.length ? selectedChannelIndex === -1 ? (
          <VideoGrid channels={channels} videos={videos} loading={isLoading} maxPerChannel={settings.videosPerChannel} onSelect={selectChannel} />
        ) : (
          <VideoList videos={videos} loading={isLoading} maxPerChannel={settings.videosPerChannel} />
        ) : (
          <Fade in={true} timeout={3000}>
            <Box className={classes.container}>
              <Typography component="div" variant="h5" color="textSecondary" className={classes.centered} style={{ cursor: 'default' }}>
                <PlaylistAddIcon style={{ fontSize: 38, verticalAlign: 'middle' }} /> Start by typing a channel name in the search box
              </Typography>
            </Box>
          </Fade>
        )}
      </main>
      <SettingsDialog settings={settings} open={openSettingsDialog} onClose={closeSettings} onSave={saveSettings} />
      <SettingsSnackbar open={!!settingsSnackbarMessage.length} message={settingsSnackbarMessage} onClose={closeSettingsSnackbar} onRefresh={refreshChannels} />
      <MessageSnackbar message={lastError?.message} open={!!lastError} onClose={() => setLastError(null)} />
    </div>
  )
}

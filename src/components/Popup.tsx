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
import SearchIcon from '@material-ui/icons/Search';
import SettingsIcon from '@material-ui/icons/Settings';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import GitHubIcon from '@material-ui/icons/GitHub';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Fade from '@material-ui/core/Fade';
import VideoList from './video/VideoList';
import SearchChannelInput from './channel/SearchChannelInput';
import { Channel, ChannelSelection } from '../models/Channel';
import { getChannelActivities, getVideoInfo } from '../helpers/youtube';
import { Video } from '../models/Video';
import { getDateBefore, memorySizeOf, isInToday } from '../helpers/utils';
import VideoGrid from './video/VideoGrid';
import { Settings } from '../models/Settings';
import { saveToStorage } from '../helpers/storage';
import { ChannelList } from './channel/ChannelList';
import { MessageSnackbar } from './shared/MessageSnackbar';
import { SettingsDialog } from './settings/SettingsDialog';
import { CustomSnackbar } from './shared/CustomSnackbar';
import { isWebExtension, createTab, executeScript } from '../helpers/browser';
import { debug, warn } from '../helpers/debug';
// @ts-ignore
import ReactPullToRefresh from 'react-pull-to-refresh';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

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
      padding: theme.spacing(1, 0),
    },
  }),
);

interface PopupProps {
  channels: Channel[];
  settings: Settings;
  cache: any;
  isReady: boolean;
}

export default function Popup(props: PopupProps) {
  const classes = useStyles();
  const theme = useTheme();
  const [channels, setChannels] = React.useState<Channel[]>(props.channels);
  const [videos, setVideos] = React.useState<Video[]>([]);
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [isReady, setIsReady] = React.useState(props.isReady);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedChannelIndex, setSelectedChannelIndex] = React.useState(ChannelSelection.All);
  const [settings, setSettings] = React.useState<Settings>(props.settings);
  const [openSettingsDialog, setOpenSettingsDialog] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [lastError, setLastError] = React.useState<Error|null>(null);
  const [cache, setCache] = React.useState<any>({});
  const [recentVideosCount, setRecentVideosCount] = React.useState(0);

  React.useEffect(() => setChannels(props.channels), [props.channels]);
  React.useEffect(() => setSettings(props.settings), [props.settings]);
  React.useEffect(() => setCache(props.cache), [props.cache]);
  React.useEffect(() => setIsReady(props.isReady), [props.isReady]);

  React.useEffect(() => {
    warn('channels or settings changed', isReady);
    if (isReady) {
      if (channels.length && !videos.length) {
        if (settings.defaultChannelSelection === ChannelSelection.All) {
          showAllChannels(true);
        } else if (settings.defaultChannelSelection === ChannelSelection.RecentVideos) {
          showRecentVideos(true);
        }
      }
      saveToStorage({
        channels: channels,
        settings: settings
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channels, settings]);

  React.useEffect(() => {
    warn('cache or channels changed', isReady);
    if (isReady) {
      debug('counting recent videos');
      const count = Object.keys(cache).reduce((total: number, channelId: string) => {
        if (channels.find((channel: Channel) => channel.id === channelId)?.isHidden) {
          return total;
        }
        const countPerChannel = (cache[channelId].filter((video: Video) => video.isRecent)).length;
        debug(channelId, countPerChannel);
        return total + countPerChannel;
      }, 0);
      debug('total count', count);
      setRecentVideosCount(count);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cache, channels]);

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
        debug('load videos from cache', channel.title, cache[channel.id]);
        resolve(cache[channel.id].slice(0, settings.videosPerChannel));
      } else {
        getChannelActivities(channel.id, getDateBefore(settings.videosAnteriority)).then((results) => {
          debug('activities of', channel.title, results);
          if (results?.items) {
            // get recent videos ids
            const videoIds = results.items.map((item: any) => item.contentDetails.upload?.videoId).filter((id: string) => id?.length);
            const cacheVideoIds = cache[channel.id]?.length ? cache[channel.id].map((video: Video) => video.id) : [];
            const recentVideoIds = videoIds.filter((videoId: string, index: number) => videoIds.indexOf(videoId) === index) // remove duplicates
                               .slice(0, settings.videosPerChannel)
                               .filter((videoId: string) => cacheVideoIds.indexOf(videoId) === -1); // no need to refetch videos already in cache
            // update old videos cache (keep only today's recent videos)
            if (cache[channel.id]?.length) {
              cache[channel.id] = cache[channel.id].map((video: Video) => {
                if (!isInToday(video.publishedAt)) {
                  video.isRecent = false;
                }
                return video;
              });
            }
            // get recent videos informations
            if (!recentVideoIds.length) {
              debug('no recent videos for this channel');
              if (cache[channel.id]?.length) {
                // update cache
                setCache({...cache});
                saveToStorage({ cache: cache });
              }
              resolve(cache[channel.id] || []);
            } else {
              debug('getting recent videos of', channel.title, { recentVideoIds: recentVideoIds, cacheVideoIds: cacheVideoIds });
              getVideoInfo(recentVideoIds).then((videosData: Video[]) => {
                // mark all new videos as recent
                //console.log(videosData);
                videosData = videosData.map((video: Video) => {
                  video.isRecent = true;
                  return video;
                });
                // merge cached & new videos
                cache[channel.id] = cache[channel.id]?.length ? [...videosData, ...cache[channel.id]] : videosData;
                // sort videos
                const videos = cache[channel.id].sort((a: Video, b: Video) => {
                  if (settings.sortVideosBy === 'views' && a.views?.count && b.views?.count) {
                    return b.views.count - a.views.count;
                  } else {
                    return b.publishedAt - a.publishedAt;
                  }
                }).slice(0, settings.videosPerChannel);
                // save to cache
                setCache({...cache});
                saveToStorage({ cache: cache });
                resolve(videos || []);
              }).catch((error: Error) => {
                displayError(error);
                resolve([]);
              });
            }
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
    debug('added channel:', channel);
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

  const selectChannel = (channel: Channel, index: number, ignoreCache: boolean = false) => {
    // Select channel
    debug('selected channel:', channel);
    setSelectedChannelIndex(index);
    // Get its videos
    setIsLoading(true);
    return getChannelVideos(channel, ignoreCache).then((videos: Video[]) => {
      setVideos(videos || []);
      setIsLoading(false);
      window.scrollTo(0, 0); // scroll to top
    });
  };
  
  const deleteChannel = (index: number) => {
    setChannels(channels.filter((_, i) => i !== index));
    if (selectedChannelIndex === index) {
      setVideos([]);
      setSelectedChannelIndex(ChannelSelection.None);
    }
  };

  const showAllChannels = (ignoreCache: boolean = false, customChannels?: Channel[]) => {
    // Select "All"
    setSelectedChannelIndex(ChannelSelection.All);
    // Get all channels videos
    setIsLoading(true);
    setVideos([]);
    let promises: Promise<any>[] = [];
    let videos: Video[] = [];
    const channelsList = customChannels || channels;

    channelsList.filter((channel: Channel) => !channel.isHidden).forEach((channel: Channel) => {

      const promise = getChannelVideos(channel, ignoreCache).then((newVideos: Video[]) => {
        debug(channel.title, newVideos);
        videos.push(...newVideos);
      });
      promises.push(promise);

    });

    return Promise.all(promises).finally(() => {
      setVideos(videos);
      setIsLoading(false);
    });
  };

  const showRecentVideos = (ignoreCache: boolean = false) => {
    // Select "Recent videos"
    setSelectedChannelIndex(ChannelSelection.RecentVideos);
    // Get recent videos
    setIsLoading(true);
    setVideos([]);
    let promises: Promise<any>[] = [];
    let videos: Video[] = [];

    channels.filter((channel: Channel) => !channel.isHidden).forEach((channel: Channel) => {

      const promise = getChannelVideos(channel, ignoreCache).then((newVideos: Video[]) => {
        debug(channel.title, newVideos);
        videos.push(...newVideos.filter((video: Video) => video.isRecent));
      });
      promises.push(promise);

    });

    return Promise.all(promises).finally(() => {
      setVideos(videos);
      setIsLoading(false);
    });
  };

  const clearRecentVideos = () => {
    Object.keys(cache).forEach((channelId: string) => {
      cache[channelId] = cache[channelId].map((video: Video) => {
        video.isRecent = false;
        return video;
      });
    });
    setCache({...cache});
    saveToStorage({ cache: cache });
    if (selectedChannelIndex === ChannelSelection.RecentVideos) {
      refreshChannels();
    }
  };

  const refreshChannels = (event?: any, selection?: ChannelSelection) => {
    if (event) {
      event.stopPropagation();
    }
    return (!selection && selectedChannelIndex === ChannelSelection.RecentVideos) || selection === ChannelSelection.RecentVideos ? showRecentVideos(true) : showAllChannels(true);
  };

  const importChannels = (channelsList: Channel[]) => {
    debug('importing channels', channelsList);
    // Update channels
    setChannels(channelsList);
    showAllChannels(true, channelsList);
    setSnackbarMessage('Channels imported!');
  };

  const clearCache = () => {
    setCache({});
    saveToStorage({ cache: {} });
    setSnackbarMessage('Cache cleared!');
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
      defaultChannelSelection: +(document.getElementById('defaultChannelSelection') as any).value,
      videosPerChannel: +(document.getElementById('videosPerChannel') as any).value,
      videosAnteriority: +(document.getElementById('videosAnteriority') as any).value,
      sortVideosBy: (document.getElementById('sortVideosBy') as any).value,
      apiKey: (document.getElementById('apiKey') as any).value,
      autoPlayVideos: (document.getElementById('autoPlayVideos') as any).checked,
      openVideosInInactiveTabs: (document.getElementById('openVideosInInactiveTabs') as any).checked,
      openChannelsOnNameClick: (document.getElementById('openChannelsOnNameClick') as any).checked,
      autoClearCache: (document.getElementById('autoClearCache') as any).checked
    });
    closeSettings();
    setSnackbarMessage('Settings saved!');
  };

  const closeSettingsSnackbar = () => {
    setSnackbarMessage('');
  };

  const openVideo = (event: any) => {
    event.stopPropagation();
    const videoUrl = event.currentTarget.href;
    if (isWebExtension() && videoUrl) {
      event.preventDefault();
      createTab(videoUrl, !settings.openVideosInInactiveTabs).then((tab: any) => {
        if (settings.autoPlayVideos) {
          executeScript(tab.id, `document.querySelector('#player video').play();`);
        }
      });
    }
  };

  const handlePullToRefresh = (resolve: Function, reject: Function) => {
    let promise: Promise<any>;
    if (selectedChannelIndex === ChannelSelection.All) {
      promise = refreshChannels();
    } else {
      promise = selectChannel(channels[selectedChannelIndex], selectedChannelIndex, true);
    }
    promise.then(() => {
      resolve();
    }).catch(() => {
      reject();
    });
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
          onShowRecentVideos={showRecentVideos}
          onRefresh={refreshChannels}
          onSelect={selectChannel}
          onDelete={deleteChannel}
          onSave={setChannels}
          onSelectedIndexChange={setSelectedChannelIndex}
          cacheSize={getCacheSize()}
          recentVideosCount={recentVideosCount}
          onClearCache={clearCache}
          onClearRecentVideos={clearRecentVideos}
          onImport={importChannels}
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
        {isReady && (channels?.length ? (
          <ReactPullToRefresh
            onRefresh={handlePullToRefresh}
            icon={videos?.length ? <ArrowDownwardIcon className="arrowicon" /> : <i></i>}
            distanceToRefresh={50}
            resistance={5}
            style={{ position: 'relative' }}
          >
            {selectedChannelIndex === ChannelSelection.All || selectedChannelIndex === ChannelSelection.RecentVideos ? (
              <VideoGrid
                channels={channels}
                videos={videos}
                settings={settings}
                loading={isLoading}
                maxPerChannel={settings.videosPerChannel}
                onSelect={selectChannel}
                onVideoClick={openVideo}
                onSave={setChannels}
                onRefresh={refreshChannels}
              />
            ) : (
              <VideoList videos={videos} loading={isLoading} maxPerChannel={settings.videosPerChannel} onVideoClick={openVideo} />
            )}
          </ReactPullToRefresh>
        ) : (
          <Fade in={true} timeout={3000}>
            <Box className={classes.container}>
              <Typography component="div" variant="h5" color="textSecondary" className={classes.centered} style={{ cursor: 'default' }}>
                <SearchIcon style={{ fontSize: 38, verticalAlign: 'middle' }} /> Start by typing a channel name in the search box
              </Typography>
            </Box>
          </Fade>
        ))}
      </main>
      <SettingsDialog settings={settings} open={openSettingsDialog} onClose={closeSettings} onSave={saveSettings} />
      <CustomSnackbar open={!!snackbarMessage.length} message={snackbarMessage} onClose={closeSettingsSnackbar} onRefresh={refreshChannels} />
      <MessageSnackbar message={lastError?.message} open={!!lastError} onClose={() => setLastError(null)} />
    </div>
  )
}

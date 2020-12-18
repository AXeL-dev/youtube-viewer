import React from 'react';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { Video } from '../../models/Video';
import { TimeAgo } from '../../helpers/utils';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import { ChannelSelection } from '../../models/Channel';
import { useStyles } from './VideoRenderer.styles';
import { isWebExtension, createTab, executeScript } from '../../helpers/browser';
import { useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { videosAtom } from '../../atoms/videos';
import { settingsAtom } from '../../atoms/settings';
import { cacheAtom } from '../../atoms/cache';
import { saveToStorage } from '../../helpers/storage';
import { selectedChannelIndexAtom } from '../../atoms/channels';
import { openSnackbarAtom } from '../../atoms/snackbar';

interface VideoRendererProps {
  video: Video;
}

export default function VideoRenderer(props: VideoRendererProps) {
  const { video } = props;
  const classes = useStyles();
  const [selectedChannelIndex] = useAtom(selectedChannelIndexAtom);
  const [settings] = useAtom(settingsAtom);
  const [videos, setVideos] = useAtom(videosAtom);
  const [cache, setCache] = useAtom(cacheAtom);
  const openSnackbar = useUpdateAtom(openSnackbarAtom);

  const openVideo = (event: Event, video: Video) => {
    event.stopPropagation();
    if (isWebExtension() && video?.url) {
      event.preventDefault();
      createTab(video.url, !settings.openVideosInInactiveTabs).then((tab: any) => {
        if (settings.autoPlayVideos) {
          executeScript(tab.id, `document.querySelector('#player video').play();`);
        }
      });
    }
    if (selectedChannelIndex === ChannelSelection.WatchLaterVideos) {
      removeVideoFromWatchLater(video);
    }
  };

  const addVideoToWatchLater = (event: Event, video: Video) => {
    event.stopPropagation();
    event.preventDefault();
    const videoIndex: number = cache[video?.channelId].findIndex((v: Video) => v.id === video?.id);
    if (videoIndex > -1) {
      if (!cache[video.channelId][videoIndex].isToWatchLater) {
        cache[video.channelId][videoIndex].isToWatchLater = true;
        setCache({...cache});
        saveToStorage({ cache: cache });
        openSnackbar({
          message: 'Video added to watch later list!',
          autoHideDuration: 1000,
          showRefreshButton: false
        });
      } else {
        openSnackbar({
          message: 'Video is already on watch later list!',
          autoHideDuration: 1000,
          showRefreshButton: false
        });
      }
    }
  };

  const removeVideoFromWatchLater = (video: Video) => {
    const videoIndex: number = cache[video?.channelId].findIndex((v: Video) => v.id === video?.id);
    if (videoIndex > -1 && cache[video.channelId][videoIndex].isToWatchLater) {
      // exclude video from shown videos
      setVideos(videos.filter((v: Video) => v.id !== video.id)); // FixMe: warning => Can't perform a React state update on an unmounted component.
      // update cache
      cache[video.channelId][videoIndex].isToWatchLater = false;
      setCache({...cache});
      saveToStorage({ cache: cache });
    }
  };

  return (
    <Link href={video.url} className={classes.anchor} target="_blank" rel="noopener" onClick={(event: any) => openVideo(event, video)}>
      <Box className={classes.imageContainer}>
        <img className={classes.image} alt="" src={video.thumbnail} />
        <Box className={`${classes.overlay} overlay`}></Box>
        <Box className={`${classes.options} options`}>
          {selectedChannelIndex !== ChannelSelection.WatchLaterVideos && 
          <IconButton size="small" className={classes.optionsButton} onClick={(event: any) => addVideoToWatchLater(event, video)}>
            <Tooltip title="Watch later" aria-label="watch-later">
              <WatchLaterIcon className={classes.optionsIcon} />
            </Tooltip>
          </IconButton>}
          <IconButton size="small" className={classes.optionsButton}>
            <Tooltip title="Watch now" aria-label="watch-now">
              <PlayArrowIcon className={`${classes.optionsIcon} bigger`} />
            </Tooltip>
          </IconButton>
        </Box>
        <Typography variant="caption" className={classes.duration}>
          {video.duration}
        </Typography>
      </Box>
      <Box pr={2} mt={1}>
        <Typography gutterBottom variant="body2">
          {video.title}
        </Typography>
        <Typography display="block" variant="caption" color="textSecondary">
          {video.channelTitle}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {`${video.views.asString || video.views} • ${TimeAgo.inWords(video.publishedAt)}`}
        </Typography>
      </Box>
    </Link>
  );
}

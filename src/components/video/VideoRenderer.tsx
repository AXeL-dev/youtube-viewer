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
import VisibilityIcon from '@material-ui/icons/Visibility';
import { ChannelSelection } from '../../models/Channel';
import { useStyles } from './VideoRenderer.styles';
import { isWebExtension, createTab, executeScript } from '../../helpers/browser';
import { useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { videosAtom } from '../../atoms/videos';
import { settingsAtom } from '../../atoms/settings';
import { cacheAtom } from '../../atoms/cache';
import { selectedChannelIndexAtom } from '../../atoms/channels';
import { openSnackbarAtom } from '../../atoms/snackbar';

interface VideoRendererProps {
  video: Video;
}

export default function VideoRenderer(props: VideoRendererProps) {
  const { video } = props;
  const classes = useStyles();
  const [videoIndex, setVideoIndex] = React.useState(-1);
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
    // Mark as watched
    const videoIndex: number = getVideoIndex();
    if (videoIndex > -1) {
      if (!cache[video.channelId][videoIndex].isWatched) {
        cache[video.channelId][videoIndex].isWatched = true;
        setCache({...cache});
      }
    }
    // Remove from watch later list
    if (selectedChannelIndex === ChannelSelection.WatchLaterVideos) {
      removeVideoFromWatchLater(video);
    }
  };

  const getVideoIndex = (forceUpdate: boolean = false) => {
    if (!forceUpdate && videoIndex !== -1) {
      return videoIndex;
    }
    const index: number = cache[video?.channelId].findIndex((v: Video) => v.id === video?.id);
    setVideoIndex(index);
    return index;
  };

  const addVideoToWatchLater = (event: Event, video: Video) => {
    event.stopPropagation();
    event.preventDefault();
    const videoIndex: number = getVideoIndex();
    if (videoIndex > -1) {
      if (!cache[video.channelId][videoIndex].isToWatchLater) {
        cache[video.channelId][videoIndex].isToWatchLater = true;
        setCache({...cache});
        openSnackbar({
          message: 'Video added to watch later list!',
          icon: 'success',
          autoHideDuration: 3000
        });
      } else {
        openSnackbar({
          message: 'Video is already on watch later list!',
          autoHideDuration: 3000
        });
      }
    }
  };

  const removeVideoFromWatchLater = (video: Video) => {
    const videoIndex: number = getVideoIndex();
    if (videoIndex > -1 && cache[video.channelId][videoIndex].isToWatchLater) {
      // exclude video from shown videos
      setVideos(videos.filter((v: Video) => v.id !== video.id));
      // update cache
      cache[video.channelId][videoIndex].isToWatchLater = false;
      setCache({...cache});
    }
  };

  const preventClick = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
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
        {video.isWatched && 
        <Box className={classes.visibilityIconBox} onClick={(event: any) => preventClick(event)}>
          <Tooltip title="Already watched" aria-label="already-watched">
            <VisibilityIcon className={classes.visibilityIcon} />
          </Tooltip>
        </Box>}
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

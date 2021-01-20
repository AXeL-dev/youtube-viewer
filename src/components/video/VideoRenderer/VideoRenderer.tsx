import React from 'react';
import { Box, Link, Typography, Tooltip, IconButton } from '@material-ui/core';
import { PlayArrowIcon, WatchLaterIcon, VisibilityIcon, DeleteIcon } from './VideoRenderer.icons';
import { Video, ChannelSelection } from 'models';
import { TimeAgo } from 'helpers/utils';
import { useStyles } from './VideoRenderer.styles';
import { isWebExtension, createTab, executeScript } from 'helpers/browser';
import { useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { videosAtom, settingsAtom, cacheAtom, selectedChannelIndexAtom, openSnackbarAtom } from 'atoms';

interface VideoRendererProps {
  video: Video;
}

export function VideoRenderer(props: VideoRendererProps) {
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
    const videoIndex = markAsWatched(video);
    if (settings.autoRemoveWatchLaterVideos) {
      removeVideoFromWatchLater(video, null, videoIndex);
    }
  };

  const markAsWatched = (video: Video): number => {
    const videoIndex: number = getVideoIndex(video);
    if (videoIndex > -1 && !cache[video.channelId][videoIndex].isWatched) {
      cache[video.channelId][videoIndex].isWatched = true;
      setCache({...cache});
    }
    return videoIndex;
  };

  const getVideoIndex = (video: Video) => {
    return cache[video?.channelId].findIndex((v: Video) => v.id === video?.id);
  };

  const preventClick = (event: Event) => {
    event.stopPropagation();
    event.preventDefault();
  };

  const addVideoToWatchLater = (event: Event, video: Video) => {
    preventClick(event);
    const videoIndex: number = getVideoIndex(video);
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

  const removeVideoFromWatchLater = (video: Video, event?: Event|null, index: number = -1) => {
    if (event) {
      preventClick(event);
    }
    const videoIndex: number = index >= 0 ? index : getVideoIndex(video);
    if (videoIndex > -1 && cache[video.channelId][videoIndex].isToWatchLater) {
      // exclude video from shown videos
      if (selectedChannelIndex === ChannelSelection.WatchLaterVideos) {
        setVideos(videos.filter((v: Video) => v.id !== video.id));
      }
      // update cache
      cache[video.channelId][videoIndex].isToWatchLater = false;
      setCache({...cache});
    }
  };

  return (
    <Link href={video.url} className={classes.anchor} target="_blank" rel="noopener" onClick={(event: any) => openVideo(event, video)}>
      <Box className={classes.imageContainer}>
        <img className={classes.image} alt="" src={video.thumbnail} />
        <Box className={`${classes.overlay} overlay`}></Box>
        <Box className={`${classes.options} options`}>
          {selectedChannelIndex !== ChannelSelection.WatchLaterVideos ? !video.isToWatchLater && (
            <IconButton size="small" className={classes.optionsButton} onClick={(event: any) => addVideoToWatchLater(event, video)}>
              <Tooltip title="Watch later" aria-label="watch-later">
                <WatchLaterIcon className={classes.optionsIcon} />
              </Tooltip>
            </IconButton>
          ) : video.isToWatchLater && (
            <IconButton size="small" className={classes.optionsButton} onClick={(event: any) => removeVideoFromWatchLater(video, event)}>
              <Tooltip title="Remove" aria-label="remove">
                <DeleteIcon className={classes.optionsIcon} />
              </Tooltip>
            </IconButton>
          )}
          <IconButton size="small" className={classes.optionsButton}>
            <Tooltip title="Watch now" aria-label="watch-now">
              <PlayArrowIcon className={`${classes.optionsIcon} bigger`} />
            </Tooltip>
          </IconButton>
        </Box>
        {video.isWatched && (
          <Box className={classes.visibilityIconBox} onClick={(event: any) => preventClick(event)}>
            <Tooltip title="Already watched" aria-label="already-watched">
              <VisibilityIcon className={classes.visibilityIcon} />
            </Tooltip>
          </Box>
        )}
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

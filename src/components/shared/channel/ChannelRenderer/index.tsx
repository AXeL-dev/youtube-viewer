import React from 'react';
import { Typography, Box, Fade } from '@material-ui/core';
import { MultiVideoGrid, VideoGrid } from 'components';
import { ArrowDownwardIcon, VideocamOffIcon, SearchIcon } from './icons';
import { useConstructor } from 'hooks';
import { debug } from 'helpers/debug';
import { windowSize, takeFullWidth } from 'components/Viewer/styles';
import { videoImageSize } from 'components/shared/video/VideoRenderer/styles';
import { useStyles } from './styles';
// @ts-ignore
import ReactPullToRefresh from 'react-pull-to-refresh';
import { useAppDispatch, useAppSelector } from 'store';
import { selectSettings } from 'store/selectors/settings';
import { selectChannels, selectCurrentChannelIndex } from 'store/selectors/channels';
import { selectVideos } from 'store/selectors/videos';
import { setChannels } from 'store/reducers/channels';
import { Channel } from 'models';

interface ChannelRendererProps {
  isLoading: boolean;
  onSelect: Function;
  onRefresh: Function;
}

export function ChannelRenderer(props: ChannelRendererProps) {
  const classes = useStyles();
  const { isLoading, onSelect, onRefresh } = props;
  const settings = useAppSelector(selectSettings);
  const selectedChannelIndex = useAppSelector(selectCurrentChannelIndex);
  const channels = useAppSelector(selectChannels);
  const videos = useAppSelector(selectVideos);
  const dispatch = useAppDispatch();
  const [height, setHeight] = React.useState('100%');
  const [maxVisibleVideos, setMaxVisibleVideos] = React.useState(3);

  useConstructor(() => {
    // Set height
    const height = takeFullWidth ? '100vh' : '100%';
    debug.log('height:', height);
    setHeight(height);
    // Set maxVisibleVideos
    const containerPadding = 48,
      windowWidth = takeFullWidth ? window.innerWidth : windowSize.width;
    let maxVisibleVideos = Math.floor((windowWidth - containerPadding) / videoImageSize.width);
    if (maxVisibleVideos > settings.videosPerChannel) {
      maxVisibleVideos = settings.videosPerChannel;
    }
    debug.log('max visible videos:', maxVisibleVideos);
    setMaxVisibleVideos(maxVisibleVideos);
  });

  const handlePullToRefresh = (resolve: Function, reject: Function) => {
    let promise: Promise<any>;
    if (selectedChannelIndex >= 0) {
      promise = onSelect(channels[selectedChannelIndex], selectedChannelIndex, true);
    } else {
      promise = onRefresh(selectedChannelIndex);
    }
    promise
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject();
      });
  };

  const handleSave = (channels: Channel[]) => {
    dispatch(setChannels(channels));
  };

  return channels?.length ? (
    <ReactPullToRefresh
      onRefresh={handlePullToRefresh}
      icon={<ArrowDownwardIcon className="arrowicon" />}
      distanceToRefresh={50}
      resistance={5}
      style={{ position: 'relative', height: `calc(${height} - 64px)`, overflow: 'auto' }}
    >
      {videos?.length === 0 && !isLoading ? (
        <Fade in={true} timeout={1000}>
          <Box className={`${classes.container} expanded`}>
            <Typography
              component="div"
              variant="h5"
              color="textSecondary"
              className={classes.centered}
              style={{ cursor: 'default' }}
            >
              <VideocamOffIcon style={{ fontSize: 38, verticalAlign: 'middle' }} /> No videos available
            </Typography>
          </Box>
        </Fade>
      ) : selectedChannelIndex < 0 ? (
        <MultiVideoGrid
          channels={channels}
          videos={videos}
          settings={settings}
          loading={isLoading}
          maxPerChannel={settings.videosPerChannel}
          maxVisible={maxVisibleVideos}
          onSelect={onSelect}
          onSave={handleSave}
          onRefresh={onRefresh}
        />
      ) : (
        <VideoGrid videos={videos} loading={isLoading} maxPerChannel={settings.videosPerChannel} />
      )}
    </ReactPullToRefresh>
  ) : (
    <Fade in={true} timeout={3000}>
      <Box className={classes.container}>
        <Typography
          component="div"
          variant="h5"
          color="textSecondary"
          className={classes.centered}
          style={{ cursor: 'default' }}
        >
          <SearchIcon style={{ fontSize: 38, verticalAlign: 'middle' }} /> Start by typing a channel name in the search
          box
        </Typography>
      </Box>
    </Fade>
  );
}

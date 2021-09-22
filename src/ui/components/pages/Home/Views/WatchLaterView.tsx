import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Channel, HomeView, Video } from 'types';
import ChannelTitle from './ChannelTitle';
import { useGetVideosByIdQuery } from 'store/services/youtube';
import ChannelVideos from './ChannelVideos';
import { useAppSelector } from 'store';
import { selectWatchLaterVideos } from 'store/selectors/videos';

export interface WatchLaterViewProps {
  channel: Channel;
  maxResults?: number;
  onError?: (error: any) => void;
  onVideoPlay: (video: Video) => void;
}

function WatchLaterView(props: WatchLaterViewProps) {
  const {
    channel,
    maxResults: maxResultsProp = 6,
    onError,
    onVideoPlay,
  } = props;
  const [maxResults, setMaxResults] = useState(maxResultsProp);
  const watchLaterVideos = useAppSelector(selectWatchLaterVideos(channel));
  const id = watchLaterVideos.map(({ videoId }) => videoId);
  const {
    data: videos = [],
    error,
    isLoading,
    isFetching,
  } = useGetVideosByIdQuery(
    {
      id,
      maxResults,
    },
    {
      skip: id.length === 0,
    }
  );
  const hasVideos = isLoading || videos.length > 0;

  const handleLoadMore = () => {
    setMaxResults(maxResults + maxResultsProp);
  };

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  return hasVideos ? (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        pb: 3,
      }}
    >
      <ChannelTitle channel={channel} />
      <ChannelVideos
        videos={videos}
        isLoading={isLoading || isFetching}
        maxResults={maxResults}
        view={HomeView.WatchLater}
        onVideoPlay={onVideoPlay}
        onLoadMore={handleLoadMore}
      />
    </Box>
  ) : null;
}

export default React.memo(WatchLaterView);

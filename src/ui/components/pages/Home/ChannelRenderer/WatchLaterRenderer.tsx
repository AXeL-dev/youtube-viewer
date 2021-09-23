import React, { useState, useEffect } from 'react';
import { Channel, HomeView, Video } from 'types';
import { useGetVideosByIdQuery } from 'store/services/youtube';
import { useAppSelector } from 'store';
import { selectWatchLaterVideos } from 'store/selectors/videos';
import ChannelRenderer from './ChannelRenderer';
import config from './ChannelVideos/config';

export interface WatchLaterRendererProps {
  channel: Channel;
  onError?: (error: any) => void;
  onVideoPlay: (video: Video) => void;
}

function WatchLaterRenderer(props: WatchLaterRendererProps) {
  const { channel, onError, onVideoPlay } = props;
  const [page, setPage] = useState(1);
  const watchLaterVideos = useAppSelector(selectWatchLaterVideos(channel));
  const ids = watchLaterVideos.map(({ videoId }) => videoId);
  const total = ids.length;
  const maxResults = Math.max(
    Math.min(total, config.itemsPerRow * page),
    config.itemsPerRow
  );
  const { data, error, isLoading, isFetching } = useGetVideosByIdQuery({
    ids,
    maxResults,
  });
  const videos = (data?.items || []).filter((video) => ids.includes(video.id)); // filter deleted videos (before refetch)

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  return (
    <ChannelRenderer
      view={HomeView.WatchLater}
      channel={channel}
      videos={videos}
      total={total}
      isLoading={isLoading || isFetching}
      maxResults={maxResults}
      onLoadMore={handleLoadMore}
      onVideoPlay={onVideoPlay}
    />
  );
}

export default React.memo(WatchLaterRenderer);

import React, { useState, useEffect } from 'react';
import { Channel, HomeView, Video } from 'types';
import { useGetVideosByIdQuery } from 'store/services/youtube';
import { useAppSelector } from 'store';
import { selectWatchLaterVideos } from 'store/selectors/videos';
import BaseView from './BaseView';
import config from './ChannelVideos/config';

export interface WatchLaterViewProps {
  channel: Channel;
  onError?: (error: any) => void;
  onVideoPlay: (video: Video) => void;
}

function WatchLaterView(props: WatchLaterViewProps) {
  const { channel, onError, onVideoPlay } = props;
  const [page, setPage] = useState(1);
  const watchLaterVideos = useAppSelector(selectWatchLaterVideos(channel));
  const ids = watchLaterVideos.map(({ videoId }) => videoId);
  const total = ids.length;
  const maxResults = Math.min(total, config.itemsPerRow * page);
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
    <BaseView
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

export default React.memo(WatchLaterView);

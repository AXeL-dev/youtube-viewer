import React, { useState } from 'react';
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
  const initialMaxResults = config.itemsPerRow * page;
  const maxResults = Math.min(ids.length, initialMaxResults);
  const { data, error, isLoading, isFetching } = useGetVideosByIdQuery({
    ids,
    maxResults,
  });
  const videos = (data || []).filter((video) => ids.includes(video.id)); // filter deleted videos (before refetch)
  const hasMore =
    videos.length > 0 && (isFetching || videos.length >= initialMaxResults);

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  return (
    <BaseView
      view={HomeView.WatchLater}
      channel={channel}
      videos={videos}
      error={error}
      isLoading={isLoading || isFetching}
      maxResults={maxResults}
      hasMore={hasMore}
      onError={onError}
      onLoadMore={handleLoadMore}
      onVideoPlay={onVideoPlay}
    />
  );
}

export default React.memo(WatchLaterView);

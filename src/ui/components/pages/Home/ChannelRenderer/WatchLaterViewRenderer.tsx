import React, { useState, useEffect } from 'react';
import { Channel, HomeView, Video } from 'types';
import { useGetVideosByIdQuery } from 'store/services/youtube';
import { useAppSelector } from 'store';
import { selectWatchLaterVideos } from 'store/selectors/videos';
import ChannelRenderer from './ChannelRenderer';
import config from './ChannelVideos/config';
import { useGrid } from 'hooks';
import { useChannelVideos } from 'providers';

export interface WatchLaterViewRendererProps {
  channel: Channel;
  onError?: (error: any) => void;
  onVideoPlay: (video: Video) => void;
}

function WatchLaterViewRenderer(props: WatchLaterViewRendererProps) {
  const { channel, onError, onVideoPlay } = props;
  const [page, setPage] = useState(1);
  const { itemsPerRow = 0 } = useGrid(config.gridColumns);
  const { setChannelData } = useChannelVideos(HomeView.WatchLater);
  const watchLaterVideos = useAppSelector(selectWatchLaterVideos(channel));
  const ids = watchLaterVideos.map(({ id }) => id);
  const total = ids.length;
  const maxResults = Math.min(total, itemsPerRow * page);
  const { data, error, isLoading, isFetching } = useGetVideosByIdQuery(
    {
      ids,
      maxResults: Math.max(maxResults, itemsPerRow),
    },
    {
      skip: itemsPerRow === 0,
    },
  );
  const videos = (data?.items || []).filter((video) => ids.includes(video.id)); // filter deleted videos (before refetch)

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  useEffect(() => {
    if (!isFetching && data) {
      setChannelData({ channel, items: videos, total });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching, data]);

  return (
    <ChannelRenderer
      view={HomeView.WatchLater}
      channel={channel}
      videos={videos}
      total={total}
      isLoading={isLoading || isFetching}
      itemsPerRow={itemsPerRow}
      maxResults={maxResults}
      onLoadMore={handleLoadMore}
      onVideoPlay={onVideoPlay}
    />
  );
}

export default WatchLaterViewRenderer;

import React, { useState, useEffect } from 'react';
import { Channel, HomeView, Video } from 'types';
import { useGetChannelVideosQuery } from 'store/services/youtube';
import ChannelRenderer from './ChannelRenderer';
import config from './ChannelVideos/config';
import { useGrid } from 'hooks';

export interface DefaultRendererProps {
  channel: Channel;
  view: HomeView;
  publishedAfter?: string;
  excludedVideosIds?: string[];
  persistVideos?: boolean;
  onError?: (error: any) => void;
  onChange?: (data: any) => void;
  onVideoPlay: (video: Video) => void;
}

function DefaultRenderer(props: DefaultRendererProps) {
  const {
    channel,
    publishedAfter,
    excludedVideosIds = [],
    persistVideos = false,
    onError,
    onChange,
    ...rest
  } = props;
  const [page, setPage] = useState(1);
  const { itemsPerRow = 0 } = useGrid(config.gridColumns);
  const maxResults = itemsPerRow * page;
  const { data, error, isLoading, isFetching } = useGetChannelVideosQuery(
    {
      channel,
      publishedAfter,
      maxResults,
      persistVideos,
    },
    {
      skip: itemsPerRow === 0,
    }
  );
  const videos =
    data?.items.filter((video) => !excludedVideosIds.includes(video.id)) || [];
  const total = data?.total || 0;

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  useEffect(() => {
    if (!isFetching && data && onChange) {
      onChange({ channel, items: videos, total });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching, onChange, videos]);

  return (
    <ChannelRenderer
      channel={channel}
      videos={videos}
      total={total}
      isLoading={isLoading || isFetching}
      itemsPerRow={itemsPerRow}
      maxResults={maxResults}
      onLoadMore={handleLoadMore}
      {...rest}
    />
  );
}

export default DefaultRenderer;

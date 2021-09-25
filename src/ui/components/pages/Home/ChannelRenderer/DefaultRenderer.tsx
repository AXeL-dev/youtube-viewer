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
  onError?: (error: any) => void;
  onVideoPlay: (video: Video) => void;
}

function DefaultRenderer(props: DefaultRendererProps) {
  const { channel, publishedAfter, onError, ...rest } = props;
  const [page, setPage] = useState(1);
  const { itemsPerRow } = useGrid(config.gridColumns);
  const maxResults = itemsPerRow * page;
  const { data, error, isLoading, isFetching } = useGetChannelVideosQuery({
    channel,
    publishedAfter,
    maxResults,
  });
  const videos = data?.items || [];
  const total = data?.total || 0;

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
import React, { useState, useEffect } from 'react';
import { Channel, HomeView, Video } from 'types';
import { useGetChannelVideosQuery } from 'store/services/youtube';
import BaseView from './BaseView';
import config from './ChannelVideos/config';

export interface CommonViewProps {
  channel: Channel;
  view: HomeView;
  publishedAfter?: string;
  onError?: (error: any) => void;
  onVideoPlay: (video: Video) => void;
}

function CommonView(props: CommonViewProps) {
  const { channel, publishedAfter, onError, ...rest } = props;
  const [page, setPage] = useState(1);
  const maxResults = config.itemsPerRow * page;
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
    <BaseView
      channel={channel}
      videos={videos}
      total={total}
      isLoading={isLoading || isFetching}
      maxResults={maxResults}
      onLoadMore={handleLoadMore}
      {...rest}
    />
  );
}

export default React.memo(CommonView);

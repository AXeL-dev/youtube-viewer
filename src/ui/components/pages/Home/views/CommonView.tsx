import React, { useState } from 'react';
import { Channel, HomeView, Video } from 'types';
import { useGetChannelVideosQuery } from 'store/services/youtube';
import BaseView from './BaseView';
import config from './ChannelVideos/config';

export interface CommonViewProps {
  channel: Channel;
  view: HomeView;
  publishedAfter: string;
  onError?: (error: any) => void;
  onVideoPlay: (video: Video) => void;
}

function CommonView(props: CommonViewProps) {
  const { channel, publishedAfter, ...rest } = props;
  const [page, setPage] = useState(1);
  const maxResults = config.itemsPerRow * page;
  const {
    data: videos = [],
    error,
    isLoading,
    isFetching,
  } = useGetChannelVideosQuery({
    channel,
    publishedAfter,
    maxResults,
  });
  const hasMore =
    videos.length > 0 && (isFetching || videos.length >= maxResults);

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  return (
    <BaseView
      channel={channel}
      videos={videos}
      error={error}
      isLoading={isLoading || isFetching}
      maxResults={maxResults}
      hasMore={hasMore}
      onLoadMore={handleLoadMore}
      {...rest}
    />
  );
}

export default React.memo(CommonView);

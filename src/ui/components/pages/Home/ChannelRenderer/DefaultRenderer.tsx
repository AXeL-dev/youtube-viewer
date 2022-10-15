import React, { useState, useEffect } from 'react';
import { Channel, HomeView, Video } from 'types';
import {
  PersistVideosOptions,
  useGetChannelVideosQuery,
} from 'store/services/youtube';
import ChannelRenderer from './ChannelRenderer';
import config from './ChannelVideos/config';
import { useGrid } from 'hooks';
import { useChannelVideos } from 'providers';

export interface DefaultRendererProps {
  view: HomeView;
  channel: Channel;
  publishedAfter?: string;
  persistVideosOptions?: PersistVideosOptions;
  filter?: (video: Video) => boolean;
  onError?: (error: any) => void;
  onVideoPlay: (video: Video) => void;
}

// should be instanciated outside the component to avoid multi-rendering
const defaultFilter = () => true;

function DefaultRenderer(props: DefaultRendererProps) {
  const {
    view,
    channel,
    publishedAfter,
    persistVideosOptions,
    filter = defaultFilter,
    onError,
    ...rest
  } = props;
  const [page, setPage] = useState(1);
  const { itemsPerRow = 0 } = useGrid(config.gridColumns);
  const { setChannelData } = useChannelVideos(view);
  const maxResults = itemsPerRow * page;
  const { data, error, isLoading, isFetching } = useGetChannelVideosQuery(
    {
      channel,
      publishedAfter,
      maxResults,
      persistVideosOptions,
    },
    {
      skip: itemsPerRow === 0,
    },
  );
  const videos = (data?.items || []).filter(filter);
  const count = data?.count || 0;
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
    if (!isFetching && data) {
      setChannelData({ channel, items: videos, total });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching, data, filter]);

  return (
    <ChannelRenderer
      view={view}
      channel={channel}
      videos={videos}
      count={count}
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

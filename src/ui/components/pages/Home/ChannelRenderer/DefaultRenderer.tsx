import React, { useState, useEffect } from 'react';
import { Channel, HomeView, Video, VideoCache, ViewFilters } from 'types';
import {
  PersistVideosOptions,
  useGetChannelVideosQuery,
} from 'store/services/youtube';
import ChannelRenderer from './ChannelRenderer';
import config from './ChannelVideos/config';
import { useGrid } from 'hooks';
import { useChannelVideos } from 'providers';
import { filterVideoByFlags } from 'store/services/youtube';

export interface DefaultRendererProps {
  view: HomeView;
  channel: Channel;
  publishedAfter?: string;
  persistVideosOptions?: PersistVideosOptions;
  cachedVideos?: { [key: string]: VideoCache };
  filters?: ViewFilters;
  onError?: (error: any) => void;
  onVideoPlay: (video: Video) => void;
}

function DefaultRenderer(props: DefaultRendererProps) {
  const {
    view,
    channel,
    publishedAfter,
    persistVideosOptions,
    cachedVideos,
    filters,
    onError,
    ...rest
  } = props;
  // const lastVideoIdRef = useRef<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const { itemsPerRow = 0 } = useGrid(config.gridColumns);
  const { setChannelData } = useChannelVideos(view);
  const maxResults = itemsPerRow * page;
  const {
    data,
    // lastVideoId,
    error,
    isLoading,
    isFetching,
  } = useGetChannelVideosQuery(
    {
      channel,
      publishedAfter,
      maxResults,
      persistVideosOptions,
      // lastVideoId: lastVideoIdRef.current,
    },
    {
      skip: itemsPerRow === 0,
      selectFromResult: (result) => ({
        ...result,
        // lastVideoId: result.data?.items[result.data.items.length - 1]?.id,
      }),
    },
  );
  let videos = data?.items || [];
  if (filters && cachedVideos) {
    videos = videos.filter(({ id }) =>
      cachedVideos[id] ? filterVideoByFlags(cachedVideos[id], filters) : true,
    );
  }

  const count = data?.count || 0;
  const total = data?.total || 0;

  const handleLoadMore = () => {
    // lastVideoIdRef.current = lastVideoId;
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
  }, [isFetching, data, cachedVideos, filters]);

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

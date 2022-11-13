import React, { useState, useEffect } from 'react';
import { Channel, HomeView, Video } from 'types';
import {
  FilterVideosOptions,
  PersistVideosOptions,
} from 'store/services/youtube';
import ChannelRenderer, { limit } from './ChannelRenderer';
import ChannelDataHandler from './ChannelDataHandler';
import config from './ChannelVideos/config';
import { useGetChannelVideos, useGrid } from 'hooks';

export interface DefaultRendererProps {
  view: HomeView;
  channel: Channel;
  publishedAfter?: string;
  persistVideosOptions?: PersistVideosOptions;
  filterVideosOptions?: FilterVideosOptions;
  onError?: (error: any) => void;
  onVideoPlay: (video: Video) => void;
}

function DefaultRenderer(props: DefaultRendererProps) {
  const {
    view,
    channel,
    publishedAfter,
    persistVideosOptions,
    filterVideosOptions,
    onError,
    ...rest
  } = props;
  // const lastVideoIdRef = useRef<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const { itemsPerRow = 0 } = useGrid(config.gridColumns);
  const maxResults = itemsPerRow * page;
  const {
    data,
    // lastVideoId,
    error,
    isLoading,
    isFetching,
  } = useGetChannelVideos({
    channel,
    publishedAfter,
    maxResults,
    persistVideosOptions,
    filterVideosOptions,
    // lastVideoId: lastVideoIdRef.current,
    limit,
    skip: itemsPerRow === 0,
    selectFromResult: (data) => ({
      ...data,
      // lastVideoId: data?.items[data.items.length - 1]?.id,
    }),
  });
  const videos = data?.items || [];
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

  return (
    <>
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
      <ChannelDataHandler
        view={view}
        channel={channel}
        videos={videos}
        total={total}
        isFetching={isFetching}
        hasData={!!data}
        deps={[isFetching, data]}
      />
    </>
  );
}

export default DefaultRenderer;

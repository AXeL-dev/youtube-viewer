import React, { useState, useEffect } from 'react';
import { Channel, HomeView, Video, VideoCache } from 'types';
import { useGetVideosByIdQuery } from 'store/services/youtube';
import ChannelRenderer from './ChannelRenderer';
import config from './ChannelVideos/config';
import { useGrid } from 'hooks';
import { useChannelVideos } from 'providers';

export interface StaticRendererProps {
  view: HomeView;
  channel: Channel;
  videos: VideoCache[];
  onVideoPlay: (video: Video) => void;
  onError?: (error: any) => void;
}

function StaticRenderer(props: StaticRendererProps) {
  const { view, channel, videos: initialVideos, onError, onVideoPlay } = props;
  const [page, setPage] = useState(1);
  const { itemsPerRow = 0 } = useGrid(config.gridColumns);
  const { setChannelData } = useChannelVideos(view);
  const ids = initialVideos.map(({ id }) => id);
  const total = ids.length;
  const maxResults = Math.min(total, itemsPerRow * page);
  const { data, error, isLoading, isFetching } = useGetVideosByIdQuery(
    {
      ids,
      maxResults,
    },
    {
      skip: itemsPerRow === 0,
    },
  );
  const videos = (data?.items || []).filter((video) =>
    // filter deleted videos (since next refetch may take time)
    ids.includes(video.id),
  );

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
      setChannelData({
        channel,
        items: videos,
        total: total - (maxResults - videos.length),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching, data]);

  return (
    <ChannelRenderer
      view={view}
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

export default StaticRenderer;

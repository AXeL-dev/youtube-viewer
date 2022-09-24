import React, { useMemo, useCallback } from 'react';
import { useAppSelector } from 'store';
import { selectSettings } from 'store/selectors/settings';
import { getDateBefore } from 'helpers/utils';
import DefaultRenderer, { DefaultRendererProps } from './DefaultRenderer';
import { selectClassifiedRecentChannelVideos } from 'store/selectors/videos';
import { Video } from 'types';

export interface RecentViewRendererProps
  extends Omit<DefaultRendererProps, 'publishedAfter'> {}

function RecentViewRenderer(props: RecentViewRendererProps) {
  const { channel } = props;
  const settings = useAppSelector(selectSettings);
  const videos = useAppSelector(
    selectClassifiedRecentChannelVideos(channel),
    (left, right) => JSON.stringify(left) === JSON.stringify(right),
  );
  const filterCallback = useCallback(
    (video: Video) =>
      settings.recentViewFilters.others
        ? !videos.excluded.includes(video.id)
        : videos.included.includes(video.id),
    [settings.recentViewFilters.others, videos],
  );
  const publishedAfter = useMemo(
    () => getDateBefore(settings.recentVideosSeniority).toISOString(),
    [settings.recentVideosSeniority],
  );

  return (
    <DefaultRenderer
      publishedAfter={publishedAfter}
      persistVideosOptions={{
        enable: true,
        flags: { recent: true },
      }}
      filter={filterCallback}
      {...props}
    />
  );
}

export default RecentViewRenderer;

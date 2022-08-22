import React, { useMemo, useCallback } from 'react';
import { useAppSelector } from 'store';
import { selectSettings } from 'store/selectors/settings';
import { getDateBefore } from 'helpers/utils';
import DefaultRenderer, { DefaultRendererProps } from './DefaultRenderer';
import { selectRecentChannelVideos } from 'store/selectors/videos';
import { isWebExtension } from 'helpers/webext';
import { Video } from 'types';

export interface RecentViewRendererProps
  extends Omit<DefaultRendererProps, 'publishedAfter'> {}

function RecentViewRenderer(props: RecentViewRendererProps) {
  const { channel } = props;
  const settings = useAppSelector(selectSettings);
  const videos = useAppSelector(selectRecentChannelVideos(channel));
  const filterCallback = useCallback(
    (video: Video) => {
      if (settings.recentViewFilters.others) {
        return !videos.excluded.includes(video.id);
      } else {
        return videos.included.includes(video.id);
      }
    },
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
        enable: isWebExtension,
        flags: { recent: true },
      }}
      filter={filterCallback}
      {...props}
    />
  );
}

export default RecentViewRenderer;

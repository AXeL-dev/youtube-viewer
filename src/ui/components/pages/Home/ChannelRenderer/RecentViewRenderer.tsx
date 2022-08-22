import React, { useMemo, useCallback } from 'react';
import { useAppSelector } from 'store';
import { selectSettings } from 'store/selectors/settings';
import { getDateBefore } from 'helpers/utils';
import DefaultRenderer, { DefaultRendererProps } from './DefaultRenderer';
import { selectChannelVideos } from 'store/selectors/videos';
import { isWebExtension } from 'helpers/webext';
import { Video } from 'types';

export interface RecentViewRendererProps
  extends Omit<DefaultRendererProps, 'publishedAfter'> {}

function RecentViewRenderer(props: RecentViewRendererProps) {
  const { channel } = props;
  const settings = useAppSelector(selectSettings);
  const videos = useAppSelector(
    selectChannelVideos(channel, settings.recentViewFilters),
  ).map(({ id }) => id);
  const filterCallback = useCallback(
    (video: Video) => videos.includes(video.id),
    [videos],
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

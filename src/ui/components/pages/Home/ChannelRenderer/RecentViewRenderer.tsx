import React from 'react';
import { useAppSelector } from 'store';
import { selectSettings } from 'store/selectors/settings';
import { getDateBefore } from 'helpers/utils';
import DefaultRenderer, { DefaultRendererProps } from './DefaultRenderer';
import {
  selectViewedVideos,
  selectWatchLaterVideos,
} from 'store/selectors/videos';

export interface RecentViewRendererProps
  extends Omit<DefaultRendererProps, 'publishedAfter'> {}

function RecentViewRenderer(props: RecentViewRendererProps) {
  const settings = useAppSelector(selectSettings);
  const viewed = useAppSelector(selectViewedVideos);
  const watchLater = useAppSelector(selectWatchLaterVideos());
  const excludedVideosIds = [
    ...(settings.recentVideosDisplayOptions.hideViewedVideos ? viewed : []),
    ...(settings.recentVideosDisplayOptions.hideWatchLaterVideos
      ? watchLater.map(({ videoId }) => videoId)
      : []),
  ];
  const publishedAfter = getDateBefore(
    settings.recentVideosSeniority
  ).toISOString();

  return (
    <DefaultRenderer
      publishedAfter={publishedAfter}
      excludedVideosIds={excludedVideosIds}
      {...props}
    />
  );
}

export default RecentViewRenderer;

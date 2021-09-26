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
  const { channel } = props;
  const settings = useAppSelector(selectSettings);
  const viewedVideos = useAppSelector(selectViewedVideos(channel));
  const watchLaterVideos = useAppSelector(selectWatchLaterVideos(channel));
  const excludedVideosIds = [
    ...(settings.recentVideosDisplayOptions.hideViewedVideos
      ? viewedVideos.map(({ id }) => id)
      : []),
    ...(settings.recentVideosDisplayOptions.hideWatchLaterVideos
      ? watchLaterVideos.map(({ id }) => id)
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

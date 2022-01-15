import React, { useMemo } from 'react';
import { useAppSelector } from 'store';
import { selectSettings } from 'store/selectors/settings';
import { getDateBefore } from 'helpers/utils';
import DefaultRenderer, { DefaultRendererProps } from './DefaultRenderer';
import { selectChannelVideos } from 'store/selectors/videos';

export interface RecentViewRendererProps
  extends Omit<DefaultRendererProps, 'publishedAfter'> {}

function RecentViewRenderer(props: RecentViewRendererProps) {
  const { channel } = props;
  const settings = useAppSelector(selectSettings);
  const videos = useAppSelector(selectChannelVideos(channel));
  const { hideViewedVideos, hideWatchLaterVideos } =
    settings.recentVideosDisplayOptions;
  const excludedVideosIds = useMemo(
    () => [
      ...(hideViewedVideos
        ? videos.filter(({ flags }) => flags.viewed).map(({ id }) => id)
        : []),
      ...(hideWatchLaterVideos
        ? videos.filter(({ flags }) => flags.toWatchLater).map(({ id }) => id)
        : []),
    ],
    [videos, hideViewedVideos, hideWatchLaterVideos]
  );
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

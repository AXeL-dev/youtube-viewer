import React, { useMemo, useCallback } from 'react';
import { useAppSelector } from 'store';
import {
  selectVideosSeniority,
  selectViewFilters,
} from 'store/selectors/settings';
import { date2ISO, getDateBefore } from 'helpers/utils';
import DefaultRenderer, { DefaultRendererProps } from './DefaultRenderer';
import { selectClassifiedChannelVideos } from 'store/selectors/videos';
import { HomeView, Video, VideosSeniority } from 'types';

export interface AllViewRendererProps
  extends Omit<DefaultRendererProps, 'publishedAfter'> {}

function AllViewRenderer(props: AllViewRendererProps) {
  const { channel } = props;
  const filters = useAppSelector(selectViewFilters(HomeView.All));
  const videosSeniority = useAppSelector(selectVideosSeniority(HomeView.All));
  const videos = useAppSelector(
    selectClassifiedChannelVideos(channel, HomeView.All),
    (left, right) => JSON.stringify(left) === JSON.stringify(right),
  );
  const filterCallback = useCallback(
    (video: Video) =>
      filters.others
        ? !videos.excluded.includes(video.id)
        : videos.included.includes(video.id),
    [filters.others, videos],
  );
  const publishedAfter = useMemo(
    () =>
      videosSeniority === VideosSeniority.Any
        ? undefined
        : date2ISO(getDateBefore(videosSeniority)),
    [videosSeniority],
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

export default AllViewRenderer;

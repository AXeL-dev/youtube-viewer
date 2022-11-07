import React, { useMemo } from 'react';
import { useAppSelector } from 'store';
import {
  selectVideosSeniority,
  selectViewFilters,
} from 'store/selectors/settings';
import { date2ISO, getDateBefore } from 'helpers/utils';
import DefaultRenderer, { DefaultRendererProps } from './DefaultRenderer';
import { selectChannelVideosById } from 'store/selectors/videos';
import { HomeView, VideosSeniority } from 'types';
import { jsonEqualityFn } from 'store/utils';

export interface AllViewRendererProps
  extends Omit<DefaultRendererProps, 'publishedAfter'> {}

// should be instanciated outside the component to avoid multi-rendering
const persistVideosOptions = {
  enable: true,
  flags: { recent: true },
};

function AllViewRenderer(props: AllViewRendererProps) {
  const { channel } = props;
  const filters = useAppSelector(selectViewFilters(HomeView.All));
  const videosSeniority = useAppSelector(selectVideosSeniority(HomeView.All));
  const videos = useAppSelector(
    selectChannelVideosById(channel),
    jsonEqualityFn,
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
      persistVideosOptions={persistVideosOptions}
      cachedVideos={videos}
      filters={filters}
      {...props}
    />
  );
}

export default AllViewRenderer;

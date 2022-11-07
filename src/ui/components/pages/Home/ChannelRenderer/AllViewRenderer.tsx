import React, { useCallback, useMemo } from 'react';
import { useAppSelector } from 'store';
import {
  selectVideosSeniority,
  selectViewFilters,
} from 'store/selectors/settings';
import { date2ISO, getDateBefore } from 'helpers/utils';
import DefaultRenderer, { DefaultRendererProps } from './DefaultRenderer';
import { selectChannelVideosById } from 'store/selectors/videos';
import { HomeView, Video, VideoCache, VideosSeniority } from 'types';
import { filterVideoByFlags } from 'store/services/youtube';
import { jsonEqualityFn } from 'store/utils';

export interface AllViewRendererProps
  extends Omit<DefaultRendererProps, 'publishedAfter'> {}

// should be instanciated outside the component to avoid multi-rendering
const persistVideosOptions = {
  enable: true,
  flags: { recent: true },
};

const filterableFlags = [
  'seen',
  'toWatchLater',
  'archived',
  'ignored',
  'bookmarked',
];

const videosCacheFilter = ({ flags }: VideoCache) =>
  Object.keys(flags).some((flag) => filterableFlags.includes(flag));

function AllViewRenderer(props: AllViewRendererProps) {
  const { channel } = props;
  const filters = useAppSelector(selectViewFilters(HomeView.All));
  const videosSeniority = useAppSelector(selectVideosSeniority(HomeView.All));
  const videos = useAppSelector(
    selectChannelVideosById(channel, videosCacheFilter),
    jsonEqualityFn,
  );
  const filterCallback = useCallback(
    ({ id }: Video) =>
      videos[id] ? filterVideoByFlags(videos[id], filters) : filters.others,
    [filters, videos],
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
      filter={filterCallback}
      {...props}
    />
  );
}

export default AllViewRenderer;

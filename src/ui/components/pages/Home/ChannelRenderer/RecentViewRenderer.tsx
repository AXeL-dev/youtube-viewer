import React, { useMemo, useCallback } from 'react';
import { useAppSelector } from 'store';
import { selectSettings } from 'store/selectors/settings';
import { getDateBefore } from 'helpers/utils';
import DefaultRenderer, { DefaultRendererProps } from './DefaultRenderer';
import {
  filterVideoByFlags,
  selectChannelVideos,
} from 'store/selectors/videos';
import { isWebExtension } from 'helpers/webext';
import { Video } from 'types';

export interface RecentViewRendererProps
  extends Omit<DefaultRendererProps, 'publishedAfter'> {}

function RecentViewRenderer(props: RecentViewRendererProps) {
  const { channel } = props;
  const settings = useAppSelector(selectSettings);
  const videos = useAppSelector(selectChannelVideos(channel));
  const filters = settings.recentViewFilters;
  const { exclusionList, inclusionList } = useMemo(
    () => ({
      exclusionList: videos
        .filter(({ flags }) => !filterVideoByFlags(flags, filters))
        .map(({ id }) => id),
      inclusionList: videos
        .filter(({ flags }) => filterVideoByFlags(flags, filters))
        .map(({ id }) => id),
    }),
    [videos, filters]
  );
  const filterCallback = useCallback(
    (video: Video) => {
      if (filters.uncategorised) {
        return !exclusionList.includes(video.id);
      } else {
        return inclusionList.includes(video.id);
      }
    },
    [filters.uncategorised, exclusionList, inclusionList]
  );
  const publishedAfter = getDateBefore(
    settings.recentVideosSeniority
  ).toISOString();

  return (
    <DefaultRenderer
      publishedAfter={publishedAfter}
      persistVideos={isWebExtension}
      persistVideosFlags={{ recent: true }}
      filter={filterCallback}
      {...props}
    />
  );
}

export default RecentViewRenderer;

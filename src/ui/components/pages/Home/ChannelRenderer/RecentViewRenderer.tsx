import React from 'react';
import { useAppSelector } from 'store';
import { selectSettings } from 'store/selectors/settings';
import { getDateBefore } from 'helpers/utils';
import DefaultRenderer, { DefaultRendererProps } from './DefaultRenderer';

export interface RecentViewRendererProps
  extends Omit<DefaultRendererProps, 'publishedAfter'> {}

function RecentViewRenderer(props: RecentViewRendererProps) {
  const settings = useAppSelector(selectSettings);
  const publishedAfter = getDateBefore(
    settings.recentVideosSeniority
  ).toISOString();

  return <DefaultRenderer publishedAfter={publishedAfter} {...props} />;
}

export default RecentViewRenderer;

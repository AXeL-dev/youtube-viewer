import React from 'react';
import { useAppSelector } from 'store';
import { selectSettings } from 'store/selectors/settings';
import { getDateBefore } from 'helpers/utils';
import DefaultRenderer, { DefaultRendererProps } from './DefaultRenderer';

export interface RecentRendererProps
  extends Omit<DefaultRendererProps, 'publishedAfter'> {}

function RecentRenderer(props: RecentRendererProps) {
  const settings = useAppSelector(selectSettings);
  const publishedAfter = getDateBefore(
    settings.recentVideosSeniority
  ).toISOString();

  return <DefaultRenderer publishedAfter={publishedAfter} {...props} />;
}

export default RecentRenderer;

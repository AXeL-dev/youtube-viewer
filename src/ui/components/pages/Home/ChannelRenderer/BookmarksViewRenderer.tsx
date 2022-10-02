import React from 'react';
import { useAppSelector } from 'store';
import { selectBookmarkedVideos } from 'store/selectors/videos';
import StaticRenderer, { StaticRendererProps } from './StaticRenderer';

export interface BookmarksViewRendererProps
  extends Omit<StaticRendererProps, 'videos'> {}

function BookmarksViewRenderer(props: BookmarksViewRendererProps) {
  const { channel, ...rest } = props;
  const videos = useAppSelector(selectBookmarkedVideos(channel));

  return <StaticRenderer channel={channel} videos={videos} {...rest} />;
}

export default BookmarksViewRenderer;

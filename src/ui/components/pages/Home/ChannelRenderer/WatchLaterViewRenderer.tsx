import React from 'react';
import { useAppSelector } from 'store';
import { selectWatchLaterVideos } from 'store/selectors/videos';
import StaticRenderer, { StaticRendererProps } from './StaticRenderer';

export interface WatchLaterViewRendererProps
  extends Omit<StaticRendererProps, 'videos'> {}

function WatchLaterViewRenderer(props: WatchLaterViewRendererProps) {
  const { channel, ...rest } = props;
  const videos = useAppSelector(selectWatchLaterVideos(channel));

  return <StaticRenderer channel={channel} videos={videos} {...rest} />;
}

export default WatchLaterViewRenderer;

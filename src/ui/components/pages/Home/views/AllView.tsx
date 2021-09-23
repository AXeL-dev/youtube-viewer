import React from 'react';
import { Channel, HomeView, Video } from 'types';
import CommonView from './CommonView';

export interface AllViewProps {
  channel: Channel;
  onError?: (error: any) => void;
  onVideoPlay: (video: Video) => void;
}

function AllView(props: AllViewProps) {
  return <CommonView view={HomeView.All} {...props} />;
}

export default React.memo(AllView);

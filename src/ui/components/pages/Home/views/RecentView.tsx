import React from 'react';
import { Channel, HomeView, Video } from 'types';
import { getDateBefore } from 'helpers/utils';
import CommonView from './CommonView';

export interface RecentViewProps {
  channel: Channel;
  onError?: (error: any) => void;
  onVideoPlay: (video: Video) => void;
}

function RecentView(props: RecentViewProps) {
  const publishedAfter = getDateBefore(1).toISOString();

  return (
    <CommonView
      view={HomeView.Recent}
      publishedAfter={publishedAfter}
      {...props}
    />
  );
}

export default React.memo(RecentView);

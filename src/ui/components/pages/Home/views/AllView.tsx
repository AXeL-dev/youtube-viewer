import React from 'react';
import { Channel, HomeView, Video } from 'types';
import { getDateBefore } from 'helpers/utils';
import CommonView from './CommonView';

export interface AllViewProps {
  channel: Channel;
  onError?: (error: any) => void;
  onVideoPlay: (video: Video) => void;
}

function AllView(props: AllViewProps) {
  const publishedAfter = getDateBefore(30).toISOString();

  return (
    <CommonView
      view={HomeView.All}
      publishedAfter={publishedAfter}
      {...props}
    />
  );
}

export default React.memo(AllView);

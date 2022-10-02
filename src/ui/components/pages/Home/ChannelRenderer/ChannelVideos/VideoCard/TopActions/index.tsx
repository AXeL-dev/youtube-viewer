import React from 'react';
import { Box } from '@mui/material';
import { HomeView, Video } from 'types';
import WatchLaterAction from './WatchLaterAction';
import SeenAction from './SeenAction';
import ArchiveAction from './ArchiveAction';
import IgnoreAction from './IgnoreAction';
import CopyLinkAction from './CopyLinkAction';
import BookmarkAction from './BookmarkAction';

interface VideoTopActionsProps {
  video: Video;
  view: HomeView;
}

function VideoTopActions(props: VideoTopActionsProps) {
  const { video, view } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        position: 'absolute',
        top: 0,
        right: 0,
        margin: '4px',
        gap: '4px',
      }}
    >
      <CopyLinkAction video={video} />
      <IgnoreAction video={video} view={view} />
      <SeenAction video={video} />
      <ArchiveAction video={video} view={view} />
      {view === HomeView.Bookmarks ? (
        <>
          <WatchLaterAction video={video} view={view} />
          <BookmarkAction video={video} view={view} />
        </>
      ) : (
        <>
          <BookmarkAction video={video} view={view} />
          <WatchLaterAction video={video} view={view} />
        </>
      )}
    </Box>
  );
}

function propsAreEqual(
  prevProps: VideoTopActionsProps,
  nextProps: VideoTopActionsProps,
) {
  return (
    prevProps.view === nextProps.view &&
    prevProps.video.id === nextProps.video.id
  );
}

export default React.memo(VideoTopActions, propsAreEqual);

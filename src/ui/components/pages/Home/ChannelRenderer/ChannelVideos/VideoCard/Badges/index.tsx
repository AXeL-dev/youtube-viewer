import React from 'react';
import { Box } from '@mui/material';
import { HomeView, Video } from 'types';
import SeenBadge from './SeenBadge';
import ArchivedBadge from './ArchivedBadge';
import IgnoredBadge from './IgnoredBadge';

interface VideoBadgesProps {
  video: Video;
  view: HomeView;
}

function VideoBadges(props: VideoBadgesProps) {
  const { video, view } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        position: 'absolute',
        bottom: 0,
        left: 0,
        margin: '4px',
        gap: '4px',
      }}
    >
      <SeenBadge video={video} />
      <IgnoredBadge video={video} view={view} />
      <ArchivedBadge video={video} view={view} />
    </Box>
  );
}

function propsAreEqual(
  prevProps: VideoBadgesProps,
  nextProps: VideoBadgesProps,
) {
  return (
    prevProps.view === nextProps.view &&
    prevProps.video.id === nextProps.video.id
  );
}

export default React.memo(VideoBadges, propsAreEqual);

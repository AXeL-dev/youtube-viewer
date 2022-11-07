import React from 'react';
import { Box } from '@mui/material';
import { Channel, HomeView } from 'types';
import ChannelLink from './ChannelLink';
import ChannelAvatar from './ChannelAvatar';
import ChannelName from './ChannelName';
import ChannelExpandToggle from './ChannelExpandToggle';

interface ChannelTitleProps {
  view: HomeView;
  channel: Channel;
}

function ChannelTitle(props: ChannelTitleProps) {
  const { view, channel } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        pb: 2,
      }}
    >
      <ChannelLink channel={channel}>
        <ChannelAvatar view={view} channel={channel} />
      </ChannelLink>
      <ChannelName view={view} channel={channel} />
      <ChannelExpandToggle />
    </Box>
  );
}

function propsAreEqual(
  prevProps: ChannelTitleProps,
  nextProps: ChannelTitleProps,
) {
  return (
    prevProps.view === nextProps.view &&
    prevProps.channel.id === nextProps.channel.id
  );
}

export default React.memo(ChannelTitle, propsAreEqual);

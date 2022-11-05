import React from 'react';
import { Box, Typography } from '@mui/material';
import { Channel, HomeView } from 'types';
import ChannelLink from './ChannelLink';
import ChannelAvatar from './ChannelAvatar';
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
      <ChannelLink channel={channel}>
        <Typography variant="subtitle1" color="text.primary">
          {channel.title}
        </Typography>
      </ChannelLink>
      <ChannelExpandToggle />
    </Box>
  );
}

function propsAreEqual(
  prevProps: ChannelTitleProps,
  nextProps: ChannelTitleProps,
) {
  return prevProps.channel.id === nextProps.channel.id;
}

export default React.memo(ChannelTitle, propsAreEqual);

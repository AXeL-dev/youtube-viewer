import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';
import { Channel } from 'types';
import ChannelLink from './ChannelLink';

interface ChannelTitleProps {
  channel: Channel;
}

function ChannelTitle(props: ChannelTitleProps) {
  const { channel } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        pb: 2,
      }}
    >
      <ChannelLink channel={channel}>
        <Avatar alt={channel.title} src={channel.thumbnail} />
      </ChannelLink>
      <ChannelLink channel={channel}>
        <Typography sx={{ ml: 1.5 }} variant="subtitle1" color="text.primary">
          {channel.title}
        </Typography>
      </ChannelLink>
    </Box>
  );
}

function propsAreEqual(
  prevProps: ChannelTitleProps,
  nextProps: ChannelTitleProps
) {
  return prevProps.channel.id === nextProps.channel.id;
}

export default React.memo(ChannelTitle, propsAreEqual);

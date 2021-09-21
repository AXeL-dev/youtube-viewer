import React from 'react';
import { Link, Avatar, Typography } from '@mui/material';
import { Channel } from 'types';

interface ChannelTitleProps {
  channel: Channel;
}

function ChannelTitle(props: ChannelTitleProps) {
  const { channel } = props;

  return (
    <Link
      sx={{
        display: 'flex',
        alignItems: 'center',
        outline: 'none',
        textDecoration: 'none',
        pb: 2,
      }}
      href={channel.url}
      target="_blank"
      rel="noopener"
    >
      <Avatar alt={channel.title} src={channel.thumbnail} />
      <Typography sx={{ ml: 1.5 }} variant="subtitle1" color="text.primary">
        {channel.title}
      </Typography>
    </Link>
  );
}

export default React.memo(ChannelTitle);

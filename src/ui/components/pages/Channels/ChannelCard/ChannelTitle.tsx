import React from 'react';
import { Link } from '@mui/material';
import { Channel } from 'types';

interface ChannelTitleProps {
  channel: Channel;
}

export default function ChannelTitle(props: ChannelTitleProps) {
  const { channel } = props;

  return (
    <Link
      sx={{
        color: 'text.primary',
        textDecoration: 'none',
      }}
      href={channel.url}
      target="_blank"
      rel="noopener"
    >
      {channel.title}
    </Link>
  );
}

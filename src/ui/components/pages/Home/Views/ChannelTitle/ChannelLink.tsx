import React from 'react';
import { Link } from '@mui/material';
import { Channel } from 'types';

interface ChannelLinkProps {
  channel: Channel;
  children: React.ReactNode;
}

function ChannelLink(props: ChannelLinkProps) {
  const { channel, children } = props;

  return (
    <Link
      sx={{ outline: 'none', textDecoration: 'none' }}
      href={channel.url}
      target="_blank"
      rel="noopener"
    >
      {children}
    </Link>
  );
}

export default React.memo(ChannelLink);

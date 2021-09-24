import React from 'react';
import { Link } from '@mui/material';
import { Channel } from 'types';

interface ChannelTitleProps {
  channel: Channel;
}

function ChannelTitle(props: ChannelTitleProps) {
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

function propsAreEqual(
  prevProps: ChannelTitleProps,
  nextProps: ChannelTitleProps
) {
  return (
    prevProps.channel.title === nextProps.channel.title &&
    prevProps.channel.url === nextProps.channel.url
  );
}

export default React.memo(ChannelTitle, propsAreEqual);

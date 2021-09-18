import React from 'react';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import Fade from '@mui/material/Fade';
import { Channel } from 'types';

interface ChannelPictureProps {
  channel: Channel;
}

export default function ChannelPicture(props: ChannelPictureProps) {
  const { channel } = props;

  return (
    <Fade in={true}>
      <Link href={channel.url} target="_blank" rel="noopener">
        <Avatar
          sx={{
            width: 60,
            height: 60,
          }}
          alt={channel.title}
          src={channel.thumbnail}
          aria-label="channel"
        />
      </Link>
    </Fade>
  );
}

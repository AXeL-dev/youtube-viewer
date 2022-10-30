import React from 'react';
import { Avatar, Link, Fade } from '@mui/material';
import { Channel } from 'types';

interface ChannelPictureProps {
  channel: Channel;
  enableTransition?: boolean;
}

interface TransitionProps {
  children: JSX.Element;
  enable?: boolean;
}

function Transition(props: TransitionProps) {
  const { enable = true, children } = props;

  return enable ? <Fade in={true}>{children}</Fade> : children;
}

function ChannelPicture(props: ChannelPictureProps) {
  const { channel, enableTransition } = props;

  return (
    <Transition enable={enableTransition}>
      <Link
        sx={{ textDecoration: 'none' }}
        href={channel.url}
        target="_blank"
        rel="noopener"
      >
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
    </Transition>
  );
}

function propsAreEqual(
  prevProps: ChannelPictureProps,
  nextProps: ChannelPictureProps,
) {
  return (
    prevProps.channel.title === nextProps.channel.title &&
    prevProps.channel.thumbnail === nextProps.channel.thumbnail &&
    prevProps.channel.url === nextProps.channel.url
  );
}

export default React.memo(ChannelPicture, propsAreEqual);

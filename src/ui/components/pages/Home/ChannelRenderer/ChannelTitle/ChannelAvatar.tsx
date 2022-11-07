import React from 'react';
import { Avatar, Badge } from '@mui/material';
import { Channel, HomeView } from 'types';
import { useAppSelector } from 'store';
import { selectViewChannelOption } from 'store/selectors/settings';
import { useChannelVideos } from 'providers';

interface ChannelAvatarProps {
  view: HomeView;
  channel: Channel;
}

function ChannelAvatar(props: ChannelAvatarProps) {
  const { view, channel } = props;
  const displayVideosCount = useAppSelector(
    selectViewChannelOption(view, 'displayVideosCount'),
  );
  const { getChannelVideosCount } = useChannelVideos(view);
  const videosCount = displayVideosCount
    ? getChannelVideosCount(channel)
    : null;

  return (
    <Badge
      color="primary"
      badgeContent={videosCount}
      title={`${videosCount || ''}`}
    >
      <Avatar alt={channel.title} src={channel.thumbnail} />
    </Badge>
  );
}

export default ChannelAvatar;

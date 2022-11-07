import React from 'react';
import { SxProps, Typography } from '@mui/material';
import { Channel, HomeView } from 'types';
import { useAppSelector } from 'store';
import { selectViewChannelOption } from 'store/selectors/settings';
import ChannelLink from './ChannelLink';

interface ChannelNameProps {
  view: HomeView;
  channel: Channel;
}

function ChannelName(props: ChannelNameProps) {
  const { view, channel } = props;
  const openChannelOnNameClick = useAppSelector(
    selectViewChannelOption(view, 'openChannelOnNameClick'),
  );

  const renderName = (sx?: SxProps) => (
    <Typography sx={sx} variant="subtitle1" color="text.primary">
      {channel.title}
    </Typography>
  );

  return openChannelOnNameClick ? (
    <ChannelLink channel={channel}>{renderName()}</ChannelLink>
  ) : (
    renderName({ cursor: 'default' })
  );
}

export default ChannelName;

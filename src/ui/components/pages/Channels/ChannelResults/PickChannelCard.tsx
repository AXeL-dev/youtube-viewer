import React from 'react';
import { Box, Card, CardHeader } from '@mui/material';
import { Channel } from 'types';
import { useAppSelector } from 'store';
import { selectChannel } from 'store/selectors/channels';
import ChannelPicture from '../ChannelCard/ChannelPicture';
import ChannelTitle from '../ChannelCard/ChannelTitle';
import ChannelActions from './PickChannelActions';

interface PickChannelCardProps {
  channel: Channel;
}

export default function PickChannelCard(props: PickChannelCardProps) {
  const found = useAppSelector(selectChannel(props.channel));
  const channel = found || props.channel;

  return (
    <Box sx={{ display: 'flex' }}>
      <Card
        elevation={0}
        sx={{
          flexGrow: 1,
          bgcolor: 'transparent',
        }}
      >
        <CardHeader
          sx={{
            pl: 0,
            pr: 1,
            '& .MuiCardHeader-title': {
              fontSize: '0.975rem',
              mb: 0.25,
            },
            '& .MuiCardHeader-action': {
              alignSelf: 'center',
              ml: 2,
            },
            ...(channel.isHidden
              ? {
                  '& .MuiCardHeader-avatar': {
                    opacity: 0.5,
                  },
                  '& .MuiCardHeader-content': {
                    textDecoration: 'line-through',
                    opacity: 0.5,
                  },
                }
              : {}),
          }}
          avatar={<ChannelPicture channel={channel} />}
          action={<ChannelActions channel={channel} canEdit={!!found} />}
          title={<ChannelTitle channel={channel} />}
          subheader={channel.description}
        />
      </Card>
    </Box>
  );
}

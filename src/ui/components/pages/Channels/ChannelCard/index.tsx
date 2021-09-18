import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Channel } from 'types';
import ChannelPicture from './ChannelPicture';
import ChannelTitle from './ChannelTitle';

interface ChannelCardProps {
  channel: Channel;
}

export default function ChannelCard(props: ChannelCardProps) {
  const { channel } = props;

  return (
    <Card
      sx={{
        width: '100%',
        boxShadow: 'none',
        borderBottom: 1,
        borderColor: 'divider',
        borderRadius: 'unset',
        backgroundImage: 'none',
        backgroundColor: 'transparent',
      }}
    >
      <CardHeader
        sx={{
          pt: 2.5,
          pl: 0,
          pr: 1,
          '& .MuiCardHeader-title': {
            fontSize: '0.975rem',
            mb: 0.25,
          },
          '& .MuiCardHeader-action': {
            ml: 2,
          },
        }}
        avatar={<ChannelPicture channel={channel} />}
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={<ChannelTitle channel={channel} />}
        subheader={channel.description}
      />
    </Card>
  );
}

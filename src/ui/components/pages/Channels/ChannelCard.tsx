import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { red } from '@mui/material/colors';
import { Channel } from 'models';

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
      }}
    >
      <CardHeader
        sx={{
          pt: 2.5,
          pl: 0,
          pr: 1,
        }}
        avatar={
          <Avatar
            sx={{
              bgcolor: red[500],
              width: 60,
              height: 60,
            }}
            aria-label="recipe"
          >
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={channel.title}
        subheader={channel.description}
      />
    </Card>
  );
}

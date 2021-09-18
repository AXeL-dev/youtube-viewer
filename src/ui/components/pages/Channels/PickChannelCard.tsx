import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import { Channel } from 'types';
import { useAppSelector } from 'store';
import { selectChannel } from 'store/selectors/channels';
import { useAppDispatch } from 'store';
import { addChannel, removeChannel } from 'store/reducers/channels';
import ChannelPicture from './ChannelCard/ChannelPicture';
import ChannelTitle from './ChannelCard/ChannelTitle';

interface PickChannelCardProps {
  channel: Channel;
}

export default function PickChannelCard(props: PickChannelCardProps) {
  const { channel } = props;
  const [changed, setChanged] = useState(false);
  const exists = useAppSelector(selectChannel(channel));
  const dispatch = useAppDispatch();

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
            alignSelf: 'center',
            ml: 2,
          },
        }}
        avatar={<ChannelPicture channel={channel} />}
        action={
          <Tooltip title={exists ? (changed ? 'Remove channel' : '') : 'Add channel'} placement="left" arrow>
            <IconButton
              sx={{
                border: 1,
                transition: (theme) => theme.transitions.create(['color', 'background-color', 'border-color']),
                ...(exists
                  ? {
                      bgcolor: 'secondary.main',
                      color: 'common.white',
                      borderColor: 'secondary.main',
                      ':hover': {
                        bgcolor: 'secondary.main',
                        color: 'common.white',
                        borderColor: 'secondary.main',
                      },
                      '&.Mui-disabled': {
                        bgcolor: 'secondary.light',
                        color: 'common.white',
                        opacity: 0.5,
                      },
                    }
                  : {
                      borderColor: 'custom.lightBorder',
                      ':hover': {
                        bgcolor: 'transparent',
                        color: 'secondary.main',
                        borderColor: 'secondary.main',
                      },
                    }),
              }}
              size="small"
              aria-label="add"
              disabled={exists && !changed}
              onClick={() => {
                const action = exists ? removeChannel : addChannel;
                dispatch(action(channel));
                setChanged(true);
              }}
              disableRipple
            >
              <CheckIcon />
            </IconButton>
          </Tooltip>
        }
        title={<ChannelTitle channel={channel} />}
        subheader={channel.description}
      />
    </Card>
  );
}

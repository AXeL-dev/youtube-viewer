import React from 'react';
import { Tooltip, IconButton, Fade } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { Channel } from 'types';
import { useAppDispatch } from 'store';
import { addChannel } from 'store/reducers/channels';
import ChannelActions from '../ChannelCard/ChannelActions';

interface PickChannelActionsProps {
  channel: Channel;
  canEdit?: boolean;
}

function PickChannelActions(props: PickChannelActionsProps) {
  const { channel, canEdit } = props;
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(addChannel(channel));
  };

  return canEdit ? (
    <Fade in={true}>
      <ChannelActions channel={channel} />
    </Fade>
  ) : (
    <Tooltip title="Add channel" placement="left" arrow>
      <Fade in={true}>
        <IconButton
          sx={{
            border: 1,
            transition: (theme) =>
              theme.transitions.create([
                'color',
                'background-color',
                'border-color',
              ]),
            borderColor: 'custom.lightBorder',
            ':hover': {
              bgcolor: 'secondary.main',
              color: 'common.white',
              borderColor: 'secondary.main',
            },
          }}
          size="small"
          aria-label="add"
          onClick={handleClick}
          disableRipple
        >
          <CheckIcon />
        </IconButton>
      </Fade>
    </Tooltip>
  );
}

export default PickChannelActions;

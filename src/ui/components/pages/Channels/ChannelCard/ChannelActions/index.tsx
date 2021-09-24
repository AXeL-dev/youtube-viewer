import React, { useState } from 'react';
import { IconButton, Divider, MenuItem } from '@mui/material';
import { useAppDispatch } from 'store';
import {
  toggleChannel,
  toggleChannelNotifications,
} from 'store/reducers/channels';
import StyledMenu from './StyledMenu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import NotificationsOffOutlinedIcon from '@mui/icons-material/NotificationsOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Channel } from 'types';
import ChannelDialogs from '../ChannelDialogs';

interface ChannelActionsProps {
  channel: Channel;
}

function ChannelActions(props: ChannelActionsProps) {
  const { channel } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [openedDialog, setOpenedDialog] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRemoveClick = () => {
    setOpenedDialog('remove-channel');
    handleMenuClose();
  };

  const handleDialogsClose = () => {
    setOpenedDialog(null);
  };

  return (
    <>
      <IconButton aria-label="settings" onClick={handleMenuClick}>
        <MoreVertIcon />
      </IconButton>
      <StyledMenu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            dispatch(toggleChannelNotifications(channel));
            handleMenuClose();
          }}
          disableRipple
        >
          {channel.notifications?.isDisabled ? (
            <>
              <NotificationsActiveOutlinedIcon />
              Enable notifications
            </>
          ) : (
            <>
              <NotificationsOffOutlinedIcon />
              Disable notifications
            </>
          )}
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={() => {
            dispatch(toggleChannel(channel));
            handleMenuClose();
          }}
          disableRipple
        >
          {channel.isHidden ? (
            <>
              <VisibilityOutlinedIcon />
              Unhide
            </>
          ) : (
            <>
              <VisibilityOffOutlinedIcon />
              Hide
            </>
          )}
        </MenuItem>
        <MenuItem
          sx={{ color: 'primary.main' }}
          onClick={handleRemoveClick}
          disableRipple
        >
          <DeleteOutlineOutlinedIcon className="inherit-color" />
          Remove
        </MenuItem>
      </StyledMenu>
      <ChannelDialogs
        channel={channel}
        openedDialog={openedDialog}
        onClose={handleDialogsClose}
      />
    </>
  );
}

function propsAreEqual(
  prevProps: ChannelActionsProps,
  nextProps: ChannelActionsProps
) {
  return (
    JSON.stringify(prevProps.channel) === JSON.stringify(nextProps.channel)
  );
}

export default React.memo(ChannelActions, propsAreEqual);

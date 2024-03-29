import React, { useState } from 'react';
import { IconButton, Divider, MenuItem, Tooltip } from '@mui/material';
import { useAppDispatch } from 'store';
import {
  toggleChannel,
  toggleChannelNotifications,
} from 'store/reducers/channels';
import { StyledMenu } from 'ui/components/shared';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import NotificationsOffOutlinedIcon from '@mui/icons-material/NotificationsOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Channel, Nullable } from 'types';
import ChannelDialogs from '../ChannelDialogs';

interface ChannelActionsProps {
  channel: Channel;
}

const ChannelActions = React.forwardRef<HTMLButtonElement, ChannelActionsProps>(
  (props, ref) => {
    const { channel } = props;
    const [anchorEl, setAnchorEl] = useState<Nullable<HTMLElement>>(null);
    const [openedDialog, setOpenedDialog] = useState<Nullable<string>>(null);
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

    const handleFiltersClick = () => {
      setOpenedDialog('channel-filters');
      handleMenuClose();
    };

    const handleDialogsClose = () => {
      setOpenedDialog(null);
    };

    return (
      <>
        <IconButton ref={ref} aria-label="settings" onClick={handleMenuClick}>
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
          <MenuItem onClick={handleFiltersClick} disableRipple>
            <FilterAltIcon />
            Filters
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <Tooltip
            title={`${
              channel.isHidden ? 'Unhide' : 'Hide'
            } the channel from the 'All' view`}
            placement="left"
            arrow
          >
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
          </Tooltip>
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
  },
);

function propsAreEqual(
  prevProps: ChannelActionsProps,
  nextProps: ChannelActionsProps,
) {
  return (
    JSON.stringify(prevProps.channel) === JSON.stringify(nextProps.channel)
  );
}

export default React.memo(ChannelActions, propsAreEqual);

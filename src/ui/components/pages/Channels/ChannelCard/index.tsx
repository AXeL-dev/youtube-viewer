import React, { useState } from 'react';
import {
  Box,
  Paper,
  Card,
  CardHeader,
  IconButton,
  MenuItem,
  Divider,
  Collapse,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Channel } from 'types';
import ChannelPicture from './ChannelPicture';
import ChannelTitle from './ChannelTitle';
import StyledMenu from './StyledMenu';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import NotificationsOffOutlinedIcon from '@mui/icons-material/NotificationsOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useAppDispatch } from 'store';
import {
  removeChannel,
  toggleChannel,
  toggleChannelNotifications,
} from 'store/reducers/channels';
import RemoveChannelDialog from './RemoveChannelDialog';
import { DraggableSyntheticListeners } from '@dnd-kit/core';

export interface ChannelCardProps {
  channel: Channel;
  style?: React.CSSProperties;
  isOverlay?: boolean;
  showDragHandle?: boolean;
  listeners?: DraggableSyntheticListeners;
}

const ChannelCard = React.forwardRef(
  (props: ChannelCardProps, ref: React.LegacyRef<HTMLDivElement>) => {
    const { channel, isOverlay, showDragHandle, listeners, ...rest } = props;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openedDialog, setOpenedDialog] = useState<null | string>(null);
    const dispatch = useAppDispatch();
    const isMenuOpen = Boolean(anchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
    };

    const renderCardActions = React.useMemo(
      () => (
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
              onClick={() => {
                setOpenedDialog('remove-channel');
                handleMenuClose();
              }}
              disableRipple
            >
              <DeleteOutlineOutlinedIcon className="inherit-color" />
              Remove
            </MenuItem>
          </StyledMenu>
        </>
      ),
      [channel, anchorEl, isMenuOpen, dispatch]
    );

    const renderCard = React.useMemo(
      () => (
        <Card elevation={0} sx={{ flexGrow: 1, bgcolor: 'transparent' }}>
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
            action={renderCardActions}
            title={<ChannelTitle channel={channel} />}
            subheader={channel.description}
          />
        </Card>
      ),
      [channel, renderCardActions]
    );

    const renderDragHandle = React.useMemo(
      () => (
        <IconButton
          sx={{ cursor: 'move' }}
          aria-label="drag-handle"
          {...listeners}
        >
          <DragIndicatorIcon />
        </IconButton>
      ),
      [listeners]
    );

    const renderDialogs = React.useMemo(
      () => (
        <RemoveChannelDialog
          open={openedDialog === 'remove-channel'}
          channel={channel}
          onClose={(confirmed) => {
            if (confirmed) {
              dispatch(removeChannel(channel));
            }
            setOpenedDialog(null);
          }}
        />
      ),
      [channel, openedDialog, dispatch]
    );

    return (
      <div ref={ref} {...rest}>
        <Paper elevation={isOverlay ? 1 : 0}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'background.default',
              gap: 1.5,
            }}
          >
            {isOverlay ? (
              renderDragHandle
            ) : (
              <Collapse in={showDragHandle} orientation="horizontal">
                {renderDragHandle}
              </Collapse>
            )}
            {renderCard}
          </Box>
        </Paper>
        {renderDialogs}
      </div>
    );
  }
);

export default React.memo(ChannelCard);

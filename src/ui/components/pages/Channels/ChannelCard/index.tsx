import React, { useState, useMemo } from 'react';
import {
  Box,
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
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ChannelCardProps {
  channel: Channel;
  showDragHandle?: boolean;
}

export default function ChannelCard(props: ChannelCardProps) {
  const { channel, showDragHandle } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openedDialog, setOpenedDialog] = useState<null | string>(null);
  const dispatch = useAppDispatch();
  const isMenuOpen = Boolean(anchorEl);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    active,
    isDragging,
  } = useSortable({
    id: channel.id,
  });

  const style = {
    position: 'relative',
    zIndex: isDragging ? 1 : 'auto',
    transition: active ? transition : 'none',
    transform: CSS.Transform.toString(transform),
  } as React.CSSProperties;

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderCard = useMemo(
    () => (
      <Card
        elevation={0}
        sx={{
          flexGrow: 1,
          backgroundColor: 'background.default',
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
          action={
            <>
              <IconButton
                id="channel-settings-button"
                aria-controls="channel-settings-menu"
                aria-haspopup="true"
                aria-expanded={isMenuOpen ? 'true' : undefined}
                aria-label="settings"
                onClick={handleMenuClick}
              >
                <MoreVertIcon />
              </IconButton>
              <StyledMenu
                id="channel-settings-menu"
                MenuListProps={{
                  'aria-labelledby': 'channel-settings-button',
                }}
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
          }
          title={<ChannelTitle channel={channel} />}
          subheader={channel.description}
        />
      </Card>
    ),
    [channel, anchorEl, dispatch, isMenuOpen]
  );

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
        ref={setNodeRef}
        style={style}
        {...attributes}
      >
        <Collapse
          in={showDragHandle}
          appear={showDragHandle}
          orientation="horizontal"
        >
          <IconButton
            sx={{ cursor: 'move' }}
            aria-label="drag-handle"
            {...listeners}
          >
            <DragIndicatorIcon />
          </IconButton>
        </Collapse>
        {renderCard}
      </Box>
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
    </>
  );
}

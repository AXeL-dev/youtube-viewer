import React, { useState } from 'react';
import {
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { StyledMenu } from 'ui/components/shared';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Channel, Nullable } from 'types';
import { downloadFile } from 'helpers/file';

interface ChannelListActionsProps {
  channels: Channel[];
  showDragHandles: boolean;
  onDragHandlesToggle: (value: boolean) => void;
}

function ChannelListActions(props: ChannelListActionsProps) {
  const { channels, showDragHandles, onDragHandlesToggle } = props;
  const [anchorEl, setAnchorEl] = useState<Nullable<HTMLElement>>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDragHandles = () => {
    onDragHandlesToggle(!showDragHandles);
    handleClose();
  };

  const exportChannels = () => {
    const data = JSON.stringify(channels, null, 4);
    const file = new Blob([data], { type: 'text/json' });
    downloadFile(file, 'channels.json');
    handleClose();
  };

  return channels.length > 0 ? (
    <>
      <IconButton
        id="more-button"
        aria-label="more"
        aria-controls={open ? 'more-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <StyledMenu
        id="more-menu"
        MenuListProps={{
          'aria-labelledby': 'more-button',
          dense: true,
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {channels.length > 1 ? (
          <MenuItem onClick={toggleDragHandles}>
            <ListItemIcon>
              <DragIndicatorIcon />
            </ListItemIcon>
            <ListItemText>Toggle drag handles</ListItemText>
          </MenuItem>
        ) : null}
        <MenuItem onClick={exportChannels}>
          <ListItemIcon>
            <DownloadIcon />
          </ListItemIcon>
          <ListItemText>Export</ListItemText>
        </MenuItem>
      </StyledMenu>
    </>
  ) : null;
}

export default ChannelListActions;

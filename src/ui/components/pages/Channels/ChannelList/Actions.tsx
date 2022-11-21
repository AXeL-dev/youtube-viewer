import React, { useState, useRef, MouseEvent, ChangeEvent } from 'react';
import {
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { StyledMenu } from 'ui/components/shared';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Channel, Nullable } from 'types';
import { useAppDispatch } from 'store';
import { mergeChannels, setChannels } from 'store/reducers/channels';
import { readFile, downloadFile } from 'helpers/file';
import ImportChannelsDialog from './ImportChannelsDialog';

interface ChannelListActionsProps {
  channels: Channel[];
  showDragHandles: boolean;
  onDragHandlesToggle: (value: boolean) => void;
}

function ChannelListActions(props: ChannelListActionsProps) {
  const { channels, showDragHandles, onDragHandlesToggle } = props;
  const [anchorEl, setAnchorEl] = useState<Nullable<HTMLElement>>(null);
  const [openedDialog, setOpenedDialog] = useState<Nullable<string>>(null);
  const fileInputRef = useRef<Nullable<HTMLInputElement>>(null);
  const importedChannelsRef = useRef<Nullable<Channel[]>>(null);
  const open = Boolean(anchorEl);
  const dispatch = useAppDispatch();

  const openDialog = (dialog: string) => {
    setOpenedDialog(dialog);
  };

  const closeDialog = () => {
    setOpenedDialog(null);
  };

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

  const importChannels = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    try {
      readFile(file)
        .then((content) => {
          const channels: Channel[] = JSON.parse(content as string);
          if (channels.length > 0) {
            importedChannelsRef.current = channels;
            openDialog('import-channels');
          }
        })
        .finally(() => {
          handleClose();
        });
    } catch (e) {
      console.error(e);
    }
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
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {channels.length > 1 ? (
          <MenuItem onClick={toggleDragHandles}>
            <ListItemIcon>
              <DragIndicatorIcon />
            </ListItemIcon>
            <ListItemText>Toggle drag handles</ListItemText>
          </MenuItem>
        ) : null}
        <MenuItem
          onClick={() => {
            fileInputRef.current?.click();
          }}
        >
          <ListItemIcon>
            <UploadIcon />
          </ListItemIcon>
          <ListItemText>Import</ListItemText>
        </MenuItem>
        <MenuItem onClick={exportChannels}>
          <ListItemIcon>
            <DownloadIcon />
          </ListItemIcon>
          <ListItemText>Export</ListItemText>
        </MenuItem>
      </StyledMenu>
      <input
        type="file"
        ref={fileInputRef}
        style={{
          display: 'none',
          visibility: 'hidden',
          overflow: 'hidden',
          width: 0,
          height: 0,
        }}
        accept=".json"
        onClick={(event: MouseEvent<HTMLInputElement>) => {
          event.stopPropagation();
          event.currentTarget.value = '';
        }}
        onChange={importChannels}
      />
      <ImportChannelsDialog
        open={openedDialog === 'import-channels'}
        channels={importedChannelsRef.current!}
        onClose={(confirmed, shouldReplace) => {
          if (confirmed && importedChannelsRef.current) {
            if (shouldReplace) {
              dispatch(
                setChannels({
                  list: importedChannelsRef.current,
                }),
              );
            } else {
              dispatch(mergeChannels(importedChannelsRef.current));
            }
          }
          closeDialog();
        }}
      />
    </>
  ) : null;
}

export default ChannelListActions;

import React, { useState, useRef, ChangeEvent, MouseEvent } from 'react';
import { Nullable } from 'types';
import {
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { StyledMenu } from 'ui/components/shared';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import { useAppSelector, useAppDispatch } from 'store';
import { selectSettings } from 'store/selectors/settings';
import { downloadFile, readFile } from 'helpers/file';
import { setSettings } from 'store/reducers/settings';

interface SettingsActionsProps {}

export function SettingsActions(props: SettingsActionsProps) {
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<Nullable<HTMLElement>>(null);
  const fileInputRef = useRef<Nullable<HTMLInputElement>>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    try {
      readFile(file)
        .then((content) => {
          const data = JSON.parse(content as string);
          dispatch(setSettings(data));
        })
        .finally(() => {
          handleClose();
        });
    } catch (e) {
      console.error(e);
    }
  };

  const handleExport = () => {
    const data = JSON.stringify(settings, null, 4);
    const file = new Blob([data], { type: 'text/json' });
    downloadFile(file, 'settings.json');
    handleClose();
  };

  return (
    <>
      <IconButton
        id="settings-actions-button"
        aria-label="settings-actions"
        aria-controls={open ? 'settings-actions-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        color="default"
        size="small"
        sx={{
          position: 'absolute',
          right: 0,
          backgroundColor: (theme) => theme.palette.primary.dark,
          color: (theme) => theme.palette.common.white,
        }}
        onClick={handleClick}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <StyledMenu
        id="settings-actions-menu"
        MenuListProps={{
          'aria-labelledby': 'settings-actions-button',
          dense: true,
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleExport}>
          <ListItemIcon>
            <DownloadIcon />
          </ListItemIcon>
          <ListItemText>Export</ListItemText>
        </MenuItem>
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
        onChange={handleImport}
      />
    </>
  );
}

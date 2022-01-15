import React, { useState } from 'react';
import {
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { StyledMenu } from 'ui/components/shared';
import { useAppDispatch, useAppSelector } from 'store';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { clearWatchLaterList } from 'store/reducers/videos';
import {
  selectWatchLaterVideos,
  selectViewedWatchLaterVideosCount,
} from 'store/selectors/videos';
import ConfirmationDialog, {
  ConfirmationDialogProps,
} from './ConfirmationDialog';
import { Nullable } from 'types';
import { downloadFile } from 'helpers/file';

interface WatchLaterViewActionsProps {}

function WatchLaterViewActions(props: WatchLaterViewActionsProps) {
  const watchLaterVideos = useAppSelector(selectWatchLaterVideos());
  const viewedCount = useAppSelector(selectViewedWatchLaterVideosCount);
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<Nullable<HTMLElement>>(null);
  const open = Boolean(anchorEl);
  const [confirmationDialogProps, setConfirmationDialogProps] =
    useState<ConfirmationDialogProps>({
      open: false,
      title: '',
      text: '',
      onClose: () => {},
    });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRemoveAll = () => {
    setConfirmationDialogProps({
      open: true,
      title: 'Remove all videos',
      text: 'Are you sure that you want to remove all the videos from the watch later list?',
      onClose: (confirmed) => {
        if (confirmed) {
          dispatch(clearWatchLaterList());
        }
        setConfirmationDialogProps((state) => ({
          ...state,
          open: false,
        }));
      },
    });
    handleClose();
  };

  const handleRemoveViewed = () => {
    setConfirmationDialogProps({
      open: true,
      title: 'Remove viewed videos',
      text: 'Are you sure that you want to remove all viewed videos from the watch later list?',
      onClose: (confirmed) => {
        if (confirmed) {
          dispatch(clearWatchLaterList({ viewedOnly: true }));
        }
        setConfirmationDialogProps((state) => ({
          ...state,
          open: false,
        }));
      },
    });
    handleClose();
  };

  const handleExport = () => {
    const videos = watchLaterVideos.map(({ isToWatchLater, ...video }) => ({
      ...video,
      url: `https://www.youtube.com/watch?v=${video.id}`,
    }));
    const data = JSON.stringify(videos, null, 4);
    const file = new Blob([data], { type: 'text/json' });
    downloadFile(file, 'watch_later_videos.json');
    handleClose();
  };

  return (
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
        <MenuItem onClick={handleRemoveAll}>
          <ListItemIcon>
            <ClearAllIcon />
          </ListItemIcon>
          <ListItemText>Remove all videos</ListItemText>
        </MenuItem>
        {viewedCount > 0 ? (
          <MenuItem onClick={handleRemoveViewed}>
            <ListItemIcon>
              <VisibilityOffIcon />
            </ListItemIcon>
            <ListItemText>Remove viewed videos</ListItemText>
          </MenuItem>
        ) : null}
        <MenuItem onClick={handleExport}>
          <ListItemIcon>
            <FileDownloadIcon />
          </ListItemIcon>
          <ListItemText>Export</ListItemText>
        </MenuItem>
      </StyledMenu>
      <ConfirmationDialog {...confirmationDialogProps} />
    </>
  );
}

export default WatchLaterViewActions;

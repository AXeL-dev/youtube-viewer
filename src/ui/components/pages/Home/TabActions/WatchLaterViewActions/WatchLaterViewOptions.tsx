import React, { useState } from 'react';
import {
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  StyledMenu,
  ConfirmationDialog,
  ConfirmationDialogProps,
} from 'ui/components/shared';
import { useAppDispatch, useAppSelector } from 'store';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArchiveIcon from '@mui/icons-material/Archive';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {
  archiveVideosByFlag,
  clearWatchLaterList,
} from 'store/reducers/videos';
import {
  selectWatchLaterVideos,
  selectSeenWatchLaterVideosCount,
} from 'store/selectors/videos';
import { Nullable } from 'types';
import { downloadFile } from 'helpers/file';

interface WatchLaterViewOptionsProps {
  videosCount: number;
}

function WatchLaterViewOptions(props: WatchLaterViewOptionsProps) {
  const { videosCount } = props;
  const watchLaterVideos = useAppSelector(selectWatchLaterVideos());
  const seenCount = useAppSelector(selectSeenWatchLaterVideosCount);
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

  const handleArchiveAll = () => {
    setConfirmationDialogProps({
      open: true,
      title: 'Archive all videos',
      text: 'Are you sure that you want to archive all the videos in the watch later list?',
      onClose: (confirmed) => {
        if (confirmed) {
          dispatch(archiveVideosByFlag('toWatchLater'));
        }
        setConfirmationDialogProps((state) => ({
          ...state,
          open: false,
        }));
      },
    });
    handleClose();
  };

  const handleRemoveAll = () => {
    setConfirmationDialogProps({
      open: true,
      title: `Remove all videos (${videosCount})`,
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

  const handleRemoveSeen = () => {
    setConfirmationDialogProps({
      open: true,
      title: `Remove seen videos (${seenCount})`,
      text: 'Are you sure that you want to remove all seen videos from the watch later list?',
      onClose: (confirmed) => {
        if (confirmed) {
          dispatch(clearWatchLaterList({ seenOnly: true }));
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
    const videos = watchLaterVideos.map((video) => ({
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
        <MenuItem onClick={handleArchiveAll}>
          <ListItemIcon>
            <ArchiveIcon />
          </ListItemIcon>
          <ListItemText>Archive all videos</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleRemoveAll}>
          <ListItemIcon>
            <ClearAllIcon />
          </ListItemIcon>
          <ListItemText>Remove all videos</ListItemText>
        </MenuItem>
        {seenCount > 0 ? (
          <MenuItem onClick={handleRemoveSeen}>
            <ListItemIcon>
              <VisibilityOffIcon />
            </ListItemIcon>
            <ListItemText>Remove seen videos</ListItemText>
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

export default WatchLaterViewOptions;

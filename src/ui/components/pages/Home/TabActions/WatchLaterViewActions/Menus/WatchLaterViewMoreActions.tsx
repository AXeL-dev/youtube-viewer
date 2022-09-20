import React, { useState } from 'react';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { downloadFile } from 'helpers/file';
import { useForwardedRef } from 'hooks';
import { useAppDispatch, useAppSelector } from 'store';
import ArchiveIcon from '@mui/icons-material/Archive';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  archiveVideosByFlag,
  clearWatchLaterList,
} from 'store/reducers/videos';
import {
  selectSeenWatchLaterVideosCount,
  selectWatchLaterVideos,
} from 'store/selectors/videos';
import {
  ConfirmationDialog,
  ConfirmationDialogProps,
  NestedMenuItem,
  NestedMenuItemProps,
  NestedMenuItemRef,
} from 'ui/components/shared';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

interface WatchLaterViewMoreActionsProps
  extends Omit<NestedMenuItemProps, 'label'> {
  videosCount: number;
}

function WatchLaterViewMoreActions(props: WatchLaterViewMoreActionsProps) {
  const { videosCount, ...rest } = props;
  const watchLaterVideos = useAppSelector(selectWatchLaterVideos());
  const seenCount = useAppSelector(selectSeenWatchLaterVideosCount);
  const ref = useForwardedRef<NestedMenuItemRef>(null);
  const dispatch = useAppDispatch();
  const [confirmationDialogProps, setConfirmationDialogProps] =
    useState<ConfirmationDialogProps>({
      open: false,
      title: '',
      text: '',
      onClose: () => {},
    });

  const handleCloseMenu = () => {
    ref.current?.closeMenu();
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
    handleCloseMenu();
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
    handleCloseMenu();
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
    handleCloseMenu();
  };

  const handleExport = () => {
    const videos = watchLaterVideos.map((video) => ({
      ...video,
      url: `https://www.youtube.com/watch?v=${video.id}`,
    }));
    const data = JSON.stringify(videos, null, 4);
    const file = new Blob([data], { type: 'text/json' });
    downloadFile(file, 'watch_later_videos.json');
    handleCloseMenu();
  };

  return (
    <>
      <NestedMenuItem
        ref={ref}
        label={
          <>
            <ListItemIcon>
              <MoreHorizIcon />
            </ListItemIcon>
            <ListItemText>More</ListItemText>
          </>
        }
        {...rest}
      >
        <MenuItem onClick={handleArchiveAll} disabled={videosCount === 0}>
          <ListItemIcon>
            <ArchiveIcon />
          </ListItemIcon>
          <ListItemText>Archive all videos</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleRemoveAll} disabled={videosCount === 0}>
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
        <MenuItem onClick={handleExport} disabled={videosCount === 0}>
          <ListItemIcon>
            <FileDownloadIcon />
          </ListItemIcon>
          <ListItemText>Export</ListItemText>
        </MenuItem>
      </NestedMenuItem>
      <ConfirmationDialog {...confirmationDialogProps} />
    </>
  );
}

export default WatchLaterViewMoreActions;

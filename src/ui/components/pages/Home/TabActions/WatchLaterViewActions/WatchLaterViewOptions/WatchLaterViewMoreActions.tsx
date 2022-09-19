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
} from 'ui/components/shared';
import NestedMenu, {
  NestedMenuRef,
} from 'ui/components/shared/StyledMenu/NestedMenu';

interface WatchLaterViewMoreActionsProps {
  videosCount: number;
}

const WatchLaterViewMoreActions = React.forwardRef<
  NestedMenuRef,
  WatchLaterViewMoreActionsProps
>((props, ref) => {
  const { videosCount } = props;
  const watchLaterVideos = useAppSelector(selectWatchLaterVideos());
  const seenCount = useAppSelector(selectSeenWatchLaterVideosCount);
  const menuRef = useForwardedRef<NestedMenuRef>(ref);
  const dispatch = useAppDispatch();
  const [confirmationDialogProps, setConfirmationDialogProps] =
    useState<ConfirmationDialogProps>({
      open: false,
      title: '',
      text: '',
      onClose: () => {},
    });

  const closeMenu = () => {
    menuRef.current?.close();
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
    closeMenu();
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
    closeMenu();
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
    closeMenu();
  };

  const handleExport = () => {
    const videos = watchLaterVideos.map((video) => ({
      ...video,
      url: `https://www.youtube.com/watch?v=${video.id}`,
    }));
    const data = JSON.stringify(videos, null, 4);
    const file = new Blob([data], { type: 'text/json' });
    downloadFile(file, 'watch_later_videos.json');
    closeMenu();
  };

  return (
    <>
      <NestedMenu
        id="more-actions-menu"
        ref={menuRef}
        style={{
          minWidth: 160,
        }}
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
      </NestedMenu>
      <ConfirmationDialog {...confirmationDialogProps} />
    </>
  );
});

export default WatchLaterViewMoreActions;

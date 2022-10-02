import React, { useState } from 'react';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { downloadFile } from 'helpers/file';
import { useForwardedRef } from 'hooks';
import { useAppDispatch, useAppSelector } from 'store';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { clearBookmarksList } from 'store/reducers/videos';
import { selectBookmarkedVideos } from 'store/selectors/videos';
import {
  ConfirmationDialog,
  ConfirmationDialogProps,
  NestedMenuItem,
  NestedMenuItemProps,
  NestedMenuItemRef,
} from 'ui/components/shared';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

interface BookmarksViewMoreActionsProps
  extends Omit<NestedMenuItemProps, 'label'> {
  videosCount: number;
}

function BookmarksViewMoreActions(props: BookmarksViewMoreActionsProps) {
  const { videosCount, ...rest } = props;
  const bookmarkedVideos = useAppSelector(selectBookmarkedVideos());
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

  const handleRemoveAll = () => {
    setConfirmationDialogProps({
      open: true,
      title: `Remove all videos (${videosCount})`,
      text: 'Are you sure that you want to remove all the videos from the bookmarks list?',
      onClose: (confirmed) => {
        if (confirmed) {
          dispatch(clearBookmarksList());
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
    const videos = bookmarkedVideos.map((video) => ({
      ...video,
      url: `https://www.youtube.com/watch?v=${video.id}`,
    }));
    const data = JSON.stringify(videos, null, 4);
    const file = new Blob([data], { type: 'text/json' });
    downloadFile(file, 'bookmarked_videos.json');
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
        <MenuItem onClick={handleRemoveAll} disabled={videosCount === 0}>
          <ListItemIcon>
            <ClearAllIcon />
          </ListItemIcon>
          <ListItemText>Remove all videos</ListItemText>
        </MenuItem>
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

export default BookmarksViewMoreActions;

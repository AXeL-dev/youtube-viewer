import React, { useState, useRef } from 'react';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'store';
import { setVideosFlag } from 'store/reducers/videos';
import { selectRecentOnlyVideos } from 'store/selectors/videos';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  ConfirmationDialog,
  ConfirmationDialogProps,
  NestedMenuItem,
  NestedMenuItemProps,
  NestedMenuItemRef,
} from 'ui/components/shared';

interface RecentViewMoreActionsProps
  extends Omit<NestedMenuItemProps, 'label'> {}

function RecentViewMoreActions(props: RecentViewMoreActionsProps) {
  const ref = useRef<NestedMenuItemRef>(null);
  const videos = useAppSelector(selectRecentOnlyVideos());
  const dispatch = useAppDispatch();
  const [confirmationDialogProps, setConfirmationDialogProps] =
    useState<ConfirmationDialogProps>({
      open: false,
      title: '',
      text: '',
      onClose: () => {},
    });

  const handleMenuClose = () => {
    ref.current?.closeMenu();
  };

  const handleMarkVideosAsSeen = () => {
    setConfirmationDialogProps({
      open: true,
      title: `Mark unflagged videos as seen (${videos.length})`,
      text: 'Are you sure that you want to mark all the unflagged videos as seen?',
      onClose: (confirmed) => {
        if (confirmed) {
          dispatch(
            setVideosFlag({
              videos,
              flag: 'seen',
            }),
          );
        }
        setConfirmationDialogProps((state) => ({
          ...state,
          open: false,
        }));
      },
    });
    handleMenuClose();
  };

  const handleMarkVideosAsIgnored = () => {
    setConfirmationDialogProps({
      open: true,
      title: `Mark unflagged videos as ignored (${videos.length})`,
      text: 'Are you sure that you want to mark all the unflagged videos as ignored?',
      onClose: (confirmed) => {
        if (confirmed) {
          dispatch(
            setVideosFlag({
              videos,
              flag: 'ignored',
            }),
          );
        }
        setConfirmationDialogProps((state) => ({
          ...state,
          open: false,
        }));
      },
    });
    handleMenuClose();
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
        {...props}
      >
        <MenuItem
          onClick={handleMarkVideosAsSeen}
          disabled={videos.length === 0}
        >
          <ListItemIcon>
            <VisibilityIcon />
          </ListItemIcon>
          <ListItemText>Mark unflagged videos as seen</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={handleMarkVideosAsIgnored}
          disabled={videos.length === 0}
        >
          <ListItemIcon>
            <DoDisturbOnIcon />
          </ListItemIcon>
          <ListItemText>Mark unflagged videos as ignored</ListItemText>
        </MenuItem>
      </NestedMenuItem>
      <ConfirmationDialog {...confirmationDialogProps} />
    </>
  );
}

export default RecentViewMoreActions;

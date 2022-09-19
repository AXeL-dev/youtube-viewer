import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { useForwardedRef } from 'hooks';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import { setVideosFlag } from 'store/reducers/videos';
import { selectRecentOnlyVideos } from 'store/selectors/videos';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  ConfirmationDialog,
  ConfirmationDialogProps,
} from 'ui/components/shared';
import NestedMenu, {
  NestedMenuRef,
} from 'ui/components/shared/StyledMenu/NestedMenu';

interface RecentViewMoreActionsProps {}

const RecentViewMoreActions = React.forwardRef<
  NestedMenuRef,
  RecentViewMoreActionsProps
>((props, ref) => {
  const menuRef = useForwardedRef<NestedMenuRef>(ref);
  const videos = useAppSelector(selectRecentOnlyVideos());
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
    closeMenu();
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
      </NestedMenu>
      <ConfirmationDialog {...confirmationDialogProps} />
    </>
  );
});

export default RecentViewMoreActions;

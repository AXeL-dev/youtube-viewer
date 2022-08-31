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
import VisibilityIcon from '@mui/icons-material/Visibility';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import { setVideosFlag } from 'store/reducers/videos';
import { selectRecentOnlyVideos } from 'store/selectors/videos';
import { Nullable } from 'types';

interface RecentViewOptionsProps {}

function RecentViewOptions(props: RecentViewOptionsProps) {
  const videos = useAppSelector(selectRecentOnlyVideos());
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
    handleClose();
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
    handleClose();
  };

  return videos.length ? (
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
        <MenuItem onClick={handleMarkVideosAsSeen}>
          <ListItemIcon>
            <VisibilityIcon />
          </ListItemIcon>
          <ListItemText>Mark unflagged videos as seen</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMarkVideosAsIgnored}>
          <ListItemIcon>
            <DoDisturbOnIcon />
          </ListItemIcon>
          <ListItemText>Mark unflagged videos as ignored</ListItemText>
        </MenuItem>
      </StyledMenu>
      <ConfirmationDialog {...confirmationDialogProps} />
    </>
  ) : null;
}

export default RecentViewOptions;

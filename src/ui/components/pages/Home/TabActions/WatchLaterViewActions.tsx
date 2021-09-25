import React, { useState } from 'react';
import { Fade, IconButton, Tooltip } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'store';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { clearWatchLaterList } from 'store/reducers/videos';
import { selectViewedWatchLaterVideosCount } from 'store/selectors/videos';
import ConfirmationDialog, {
  ConfirmationDialogProps,
} from './ConfirmationDialog';

interface WatchLaterViewActionsProps {}

function WatchLaterViewActions(props: WatchLaterViewActionsProps) {
  const viewedCount = useAppSelector(selectViewedWatchLaterVideosCount);
  const dispatch = useAppDispatch();
  const [confirmationDialogProps, setConfirmationDialogProps] =
    useState<ConfirmationDialogProps>({
      open: false,
      title: '',
      text: '',
      onClose: () => {},
    });

  const handleRemoveViewed = () => {
    setConfirmationDialogProps({
      open: true,
      title: 'Remove all viewed videos',
      text: 'Are you sure that you want to remove all viewed videos from the watch later list?',
      onClose: (confirmed) => {
        if (confirmed) {
          dispatch(clearWatchLaterList());
        }
        setConfirmationDialogProps({
          ...confirmationDialogProps,
          open: false,
        });
      },
    });
  };

  return (
    <>
      <Fade in={viewedCount > 0}>
        <Tooltip title="Remove all viewed videos" placement="left" arrow>
          <IconButton aria-label="remove-viewed" onClick={handleRemoveViewed}>
            <ClearAllIcon sx={{ fontSize: '1.5rem' }} />
          </IconButton>
        </Tooltip>
      </Fade>
      <ConfirmationDialog {...confirmationDialogProps} />
    </>
  );
}

export default WatchLaterViewActions;

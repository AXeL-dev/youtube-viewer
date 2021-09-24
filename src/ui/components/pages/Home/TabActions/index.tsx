import React, { useState } from 'react';
import { Fade, IconButton, Tooltip } from '@mui/material';
import { HomeView } from 'types';
import { useAppDispatch, useAppSelector } from 'store';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { clearWatchLaterList } from 'store/reducers/videos';
import { selectViewedWatchLaterVideosCount } from 'store/selectors/videos';
import ConfirmationDialog, {
  ConfirmationDialogProps,
} from './ConfirmationDialog';

interface TabActionsProps {
  tab: HomeView;
}

function TabActions(props: TabActionsProps) {
  const { tab } = props;
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

  return tab === HomeView.WatchLater ? (
    <>
      <Fade in={viewedCount > 0}>
        <Tooltip title="Remove all viewed videos" placement="left" arrow>
          <IconButton aria-label="remove-viewed" onClick={handleRemoveViewed}>
            <ClearAllIcon />
          </IconButton>
        </Tooltip>
      </Fade>
      <ConfirmationDialog {...confirmationDialogProps} />
    </>
  ) : null;
}

export default React.memo(TabActions);

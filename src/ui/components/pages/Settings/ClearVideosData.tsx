import React, { useState } from 'react';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  ConfirmationDialog,
  ConfirmationDialogProps,
} from 'ui/components/shared';
import { useAppDispatch } from 'store';
import { setVideos } from 'store/reducers/videos';

interface IClearVideosDataProps {}

function ClearVideosData(props: IClearVideosDataProps) {
  const [confirmationDialogProps, setConfirmationDialogProps] =
    useState<ConfirmationDialogProps>({
      open: false,
      title: '',
      text: '',
      onClose: () => {},
    });
  const dispatch = useAppDispatch();

  const handleClick = () => {
    setConfirmationDialogProps({
      open: true,
      title: 'Clear saved videos data',
      text: 'Are you sure that you want to clear all saved videos data?',
      onClose: (confirmed) => {
        if (confirmed) {
          dispatch(setVideos({ list: [] }));
        }
        setConfirmationDialogProps((state) => ({
          ...state,
          open: false,
        }));
      },
    });
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<DeleteIcon />}
        sx={{ textTransform: 'none' }}
        onClick={handleClick}
      >
        Clear saved videos data
      </Button>
      <ConfirmationDialog {...confirmationDialogProps} />
    </>
  );
}

export default ClearVideosData;

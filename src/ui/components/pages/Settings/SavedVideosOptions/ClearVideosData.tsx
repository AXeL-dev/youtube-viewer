import React, { useState } from 'react';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  ConfirmationDialog,
  ConfirmationDialogProps,
} from 'ui/components/shared';
import { useAppDispatch } from 'store';
import { setVideos } from 'store/reducers/videos';
import { nanoid } from '@reduxjs/toolkit';
import { Alert } from 'ui/components/shared';
import ReactDOM from 'react-dom';

interface IClearVideosDataProps {}

export const id = nanoid();
export const icon = <DeleteIcon />;
export const label = 'Clear videos data';
export const color = 'primary';

function ClearVideosData(props: IClearVideosDataProps) {
  const [openInfoAlert, setOpenInfoAlert] = useState(false);
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
      title: 'Clear videos data',
      text: 'Are you sure that you want to clear all saved videos data?',
      onClose: (confirmed) => {
        if (confirmed) {
          dispatch(setVideos({ list: [] }));
          setOpenInfoAlert(true);
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
        startIcon={icon}
        sx={{ textTransform: 'none' }}
        onClick={handleClick}
      >
        {label}
      </Button>
      <ConfirmationDialog {...confirmationDialogProps} />
      {ReactDOM.createPortal(
        <Alert
          open={openInfoAlert}
          severity="info"
          closable
          syncOpen
          onClose={() => setOpenInfoAlert(false)}
        >
          All videos data has been cleared!
        </Alert>,
        document.getElementById('layout-content-portal')!,
      )}
    </>
  );
}

export default ClearVideosData;

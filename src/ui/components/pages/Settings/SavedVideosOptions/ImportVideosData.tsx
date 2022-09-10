import React, { useState, useRef, ChangeEvent, MouseEvent } from 'react';
import { Button } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Nullable } from 'types';
import { readFile } from 'helpers/file';
import { nanoid } from '@reduxjs/toolkit';
import { useAppDispatch } from 'store';
import { setVideos } from 'store/reducers/videos';
import { Alert } from 'ui/components/shared';
import ReactDOM from 'react-dom';

interface IImportVideosDataProps {}

export const id = nanoid();
export const icon = <FileUploadIcon />;
export const label = 'Import videos data';
export const color = 'secondary';

function ImportVideosData(props: IImportVideosDataProps) {
  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
  const fileInputRef = useRef<Nullable<HTMLInputElement>>(null);
  const dispatch = useAppDispatch();

  const importVideos = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    try {
      readFile(file).then((content) => {
        const videos = JSON.parse(content as string);
        dispatch(setVideos({ list: videos }));
        setOpenSuccessAlert(true);
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color={color}
        startIcon={icon}
        sx={{ textTransform: 'none' }}
        onClick={() => {
          fileInputRef.current?.click();
        }}
      >
        {label}
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        style={{
          display: 'none',
          visibility: 'hidden',
          overflow: 'hidden',
          width: 0,
          height: 0,
        }}
        accept=".json"
        onClick={(event: MouseEvent<HTMLInputElement>) => {
          event.stopPropagation();
          event.currentTarget.value = '';
        }}
        onChange={importVideos}
      />
      {ReactDOM.createPortal(
        <Alert
          open={openSuccessAlert}
          severity="success"
          closable
          syncOpen
          onClose={() => setOpenSuccessAlert(false)}
        >
          Videos imported successfully!
        </Alert>,
        document.getElementById('layout-content-portal')!,
      )}
    </>
  );
}

export default ImportVideosData;

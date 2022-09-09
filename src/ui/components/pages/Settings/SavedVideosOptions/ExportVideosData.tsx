import React from 'react';
import { Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { VideoCache } from 'types';
import { downloadFile } from 'helpers/file';
import { nanoid } from '@reduxjs/toolkit';

interface IExportVideosDataProps {
  videos: VideoCache[];
}

export const id = nanoid();
export const icon = <FileDownloadIcon />;
export const label = 'Export videos data';
export const color = 'secondary';

function ExportVideosData(props: IExportVideosDataProps) {
  const { videos } = props;

  const handleClick = () => {
    const videosData = videos.map((video) => ({
      ...video,
      url: `https://www.youtube.com/watch?v=${video.id}`,
    }));
    const data = JSON.stringify(videosData, null, 4);
    const file = new Blob([data], { type: 'text/json' });
    downloadFile(file, 'videos_data.json');
  };

  return (
    <Button
      variant="contained"
      color={color}
      startIcon={icon}
      sx={{ textTransform: 'none' }}
      onClick={handleClick}
    >
      {label}
    </Button>
  );
}

export default ExportVideosData;

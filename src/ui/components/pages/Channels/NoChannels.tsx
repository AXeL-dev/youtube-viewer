import React, { useRef, MouseEvent, ChangeEvent } from 'react';
import { Box, Typography, Button } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import { readFile } from 'helpers/file';
import { useAppDispatch } from 'store';
import { setChannels } from 'store/reducers/channels';

interface NoChannelsProps {}

export default function NoChannels(props: NoChannelsProps) {
  const fileInputRef = useRef(null);
  const dispatch = useAppDispatch();

  const importChannels = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    try {
      readFile(file).then((content) => {
        const channels = JSON.parse(content as string);
        dispatch(setChannels(channels));
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h5" gutterBottom>
        No channels found.
      </Typography>
      <Typography
        sx={{ textAlign: 'center', fontSize: '1.125rem' }}
        variant="body1"
        color="text.secondary"
        gutterBottom
      >
        Start by typing a channel name in the search bar above
        <br />
        or
      </Typography>
      <Button
        sx={{ textTransform: 'capitalize' }}
        variant="contained"
        color="secondary"
        onClick={() => {
          (fileInputRef.current as any)?.click();
        }}
      >
        Import channels
        <UploadIcon />
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
          (event.target as any).value = '';
        }}
        onChange={importChannels}
      />
    </Box>
  );
}

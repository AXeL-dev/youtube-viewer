import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useHistory } from 'react-router-dom';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import { useAppSelector } from 'store';
import { selectApp } from 'store/selectors/app';

interface NoChannelsProps {}

export default function NoChannels(props: NoChannelsProps) {
  const app = useAppSelector(selectApp);
  const history = useHistory();

  return app.loaded ? (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography
        sx={{ textAlign: 'center', fontSize: '1.125rem', mb: 2 }}
        variant="body1"
        color="text.secondary"
      >
        Welcome, stranger! To get started, you should add some channels
      </Typography>
      <Button
        sx={{ textTransform: 'capitalize' }}
        variant="contained"
        color="secondary"
        onClick={() => {
          history.push('/channels');
        }}
      >
        <PlaylistAddCheckIcon sx={{ fontSize: '1.25rem', mr: 0.5 }} />
        Add channels
      </Button>
    </Box>
  ) : null;
}

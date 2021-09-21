import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Alert } from 'ui/components/shared';
import { Channel } from 'types';
import { useAppSelector } from 'store';
import { selectActiveChannels } from 'store/selectors/channels';
import ChannelGrid from './ChannelGrid';

interface MainViewProps {}

export default function MainView(props: MainViewProps) {
  const [error, setError] = useState(null);
  const channels = useAppSelector(selectActiveChannels);

  const handleError = (error: any) => {
    console.log('aaa', error);
    setError(error);
  };

  return (
    <>
      {error ? <Alert error={error} /> : null}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          px: 3,
          pt: 3,
        }}
      >
        {channels.map((channel: Channel, index: number) => (
          <ChannelGrid key={index} channel={channel} onError={handleError} />
        ))}
      </Box>
    </>
  );
}

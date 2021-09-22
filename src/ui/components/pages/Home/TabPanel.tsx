import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Alert } from 'ui/components/shared';
import { Channel, HomeView } from 'types';
import { useAppSelector } from 'store';
import { selectActiveChannels } from 'store/selectors/channels';
import ChannelGrid from './ChannelGrid';

interface TabPanelProps {
  tab: HomeView;
}

export default function TabPanel(props: TabPanelProps) {
  const { tab } = props;
  const [error, setError] = useState(null);
  const channels = useAppSelector(selectActiveChannels);

  const handleError = (err: any) => {
    setError(err);
  };

  return error ? (
    <Alert error={error} closable />
  ) : (
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
        <ChannelGrid
          key={index}
          view={tab}
          channel={channel}
          onError={handleError}
        />
      ))}
    </Box>
  );
}

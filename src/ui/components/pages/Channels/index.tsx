import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Layout, SearchInput, Alert } from 'ui/components/shared';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import ChannelCard from './ChannelCard';
import { useFindChannelByNameQuery } from 'store/services/youtube';
import { Channel } from 'types';

interface ChannelsProps {}

export function Channels(props: ChannelsProps) {
  const [search, setSearch] = useState('');
  const { data: channels = [], error, isLoading } = useFindChannelByNameQuery(search, { skip: search === '' });

  return (
    <Layout>
      <Box sx={{ display: 'flex', gap: 2, py: 1.5, pr: 4, pl: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ flexGrow: 1 }}>
          <SearchInput
            width={400}
            placeholder="Search for a channel…"
            debounceTime={700}
            onChange={(value: string) => {
              setSearch(value);
            }}
            clearable
          />
        </Box>
        <IconButton title="Export" aria-label="export">
          <DownloadIcon />
        </IconButton>
      </Box>
      {error ? (
        <Alert closable>{(error as any).data.error.message}</Alert>
      ) : (
        <Box sx={{ px: 3, overflow: 'auto' }}>
          {isLoading
            ? 'Loading...'
            : channels.map((channel: Channel, index: number) => <ChannelCard key={index} channel={channel} />)}
        </Box>
      )}
    </Layout>
  );
}

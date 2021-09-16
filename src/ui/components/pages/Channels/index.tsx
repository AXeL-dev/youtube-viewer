import React from 'react';
import { Box } from '@mui/material';
import { Layout, SearchInput } from 'ui/components/shared';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import ChannelCard from './ChannelCard';

interface ChannelsProps {}

export function Channels(props: ChannelsProps) {
  return (
    <Layout>
      <Box sx={{ display: 'flex', py: 1, pr: 3, pl: 2, borderBottom: '1px solid #e0e0e0' }}>
        <SearchInput
          placeholder="Search for a channel…"
          onChange={(value: string) => {
            console.log(value);
          }}
        />
        <IconButton title="Export" aria-label="export">
          <DownloadIcon />
        </IconButton>
      </Box>
      <Box sx={{ px: 3, overflow: 'auto' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((index: number) => (
          <ChannelCard channel={{ title: 'Channel name', description: 'Channel description' } as any} key={index} />
        ))}
      </Box>
    </Layout>
  );
}

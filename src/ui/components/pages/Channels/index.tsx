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
      <Box sx={{ display: 'flex', gap: 2, py: 1.5, pr: 4, pl: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ flexGrow: 1 }}>
          <SearchInput
            width={400}
            placeholder="Search for a channel…"
            onChange={(value: string) => {
              console.log(value);
            }}
            clearable
          />
        </Box>
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

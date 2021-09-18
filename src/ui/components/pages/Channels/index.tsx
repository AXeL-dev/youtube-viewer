import React, { useState } from 'react';
import { Layout, SearchInput } from 'ui/components/shared';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Zoom from '@mui/material/Zoom';
import Collapse from '@mui/material/Collapse';
import Tooltip from '@mui/material/Tooltip';
import ChannelResults from './ChannelResults';
import ChannelCard from './ChannelCard';
import { Channel } from 'types';
import { useAppSelector } from 'store';
import { selectChannels } from 'store/selectors/channels';

interface ChannelsProps {}

export function Channels(props: ChannelsProps) {
  const [search, setSearch] = useState('');
  const channels = useAppSelector(selectChannels);
  const isSearchActive = !!search;

  const showList = () => {
    setSearch('');
  };

  return (
    <Layout>
      <Box sx={{ display: 'flex', gap: 2, py: 1.5, pr: 4, pl: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ flexGrow: 1, display: 'flex' }}>
          <Collapse in={isSearchActive} appear={isSearchActive} orientation="horizontal">
            <Tooltip title="Go back to channels list" placement="bottom" arrow>
              <IconButton sx={{ mr: 2, bgcolor: 'custom.lightGrey' }} aria-label="show-list" onClick={showList}>
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
          </Collapse>
          <SearchInput
            width={400}
            placeholder="Search for a channel…"
            debounceTime={700}
            onChange={(value: string) => {
              setSearch(value);
            }}
            onClear={showList}
            clearable
          />
        </Box>
        <Zoom in={!isSearchActive} appear={channels.length > 0}>
          <Tooltip title="Export" placement="left" arrow>
            <IconButton aria-label="export">
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Zoom>
      </Box>
      {search ? (
        <ChannelResults search={search} />
      ) : (
        <Box sx={{ px: 3, overflow: 'auto' }}>
          {channels.map((channel: Channel, index: number) => (
            <ChannelCard key={index} channel={channel} />
          ))}
        </Box>
      )}
    </Layout>
  );
}

import React, { useState } from 'react';
import { Layout, SearchInput } from 'ui/components/shared';
import { Box, IconButton, Fade, Collapse, Tooltip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import ChannelResults from './ChannelResults';
import ChannelList from './ChannelList';
import NoChannels from './NoChannels';
import { useAppSelector } from 'store';
import { selectChannels } from 'store/selectors/channels';
import { downloadFile } from 'helpers/file';

interface ChannelsProps {}

export function Channels(props: ChannelsProps) {
  const [search, setSearch] = useState('');
  const [showDragHandles, setShowDragHandles] = useState(false);
  const channels = useAppSelector(selectChannels);
  const isSearchActive = Boolean(search);

  const showList = () => {
    setSearch('');
  };

  const toggleDragHandles = () => {
    setShowDragHandles(!showDragHandles);
  };

  const exportChannels = () => {
    const data = JSON.stringify(channels, null, 4);
    const file = new Blob([data], { type: 'text/json' });
    downloadFile(file, 'channels.json');
  };

  return (
    <Layout>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider',
          gap: 2,
          py: 1.5,
          pr: 4,
          pl: 3,
        }}
      >
        <Box sx={{ flexGrow: 1, display: 'flex' }}>
          <Collapse
            in={isSearchActive}
            appear={isSearchActive}
            orientation="horizontal"
          >
            <Tooltip title="Go back to channels list" placement="bottom" arrow>
              <IconButton
                sx={{ mr: 2, bgcolor: 'custom.lightGrey' }}
                aria-label="show-list"
                onClick={showList}
              >
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
        <Fade in={!isSearchActive && channels.length > 1}>
          <Tooltip title="Toggle drag handles" placement="left" arrow>
            <IconButton
              sx={showDragHandles ? { bgcolor: 'action.selected' } : {}}
              aria-label="toggle-drag-handles"
              onClick={toggleDragHandles}
            >
              <SwapVertIcon />
            </IconButton>
          </Tooltip>
        </Fade>
        <Fade in={!isSearchActive && channels.length > 0}>
          <Tooltip title="Export" placement="left" arrow>
            <IconButton aria-label="export" onClick={exportChannels}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Fade>
      </Box>
      {search ? (
        <ChannelResults search={search} />
      ) : channels.length > 0 ? (
        <ChannelList channels={channels} showDragHandles={showDragHandles} />
      ) : (
        <NoChannels />
      )}
    </Layout>
  );
}

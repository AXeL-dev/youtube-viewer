import React, { useState } from 'react';
import { Layout, SearchInput } from 'ui/components/shared';
import { Box, IconButton, Collapse, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChannelResults from './ChannelResults';
import ChannelList from './ChannelList';
import NoChannels from './NoChannels';
import { useAppSelector } from 'store';
import { selectChannels } from 'store/selectors/channels';
import ChannelListActions from './ChannelList/Actions';

interface ChannelsProps {}

export function Channels(props: ChannelsProps) {
  const [search, setSearch] = useState('');
  const [showDragHandles, setShowDragHandles] = useState(false);
  const channels = useAppSelector(selectChannels);
  const isSearchActive = Boolean(search);

  const showList = () => {
    setSearch('');
  };

  return (
    <Layout>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider',
          padding: (theme) => theme.spacing(1.5, 3),
          gap: 2,
        }}
      >
        <Box sx={{ flexGrow: 1, display: 'flex' }}>
          <Collapse in={isSearchActive} orientation="horizontal">
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
            debounceTime={500}
            onChange={(value: string) => {
              setSearch(value);
            }}
            onClear={showList}
            clearable
          />
        </Box>
        {!isSearchActive ? (
          <ChannelListActions
            channels={channels}
            showDragHandles={showDragHandles}
            onDragHandlesToggle={setShowDragHandles}
          />
        ) : null}
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

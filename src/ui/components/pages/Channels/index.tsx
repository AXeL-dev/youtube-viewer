import React, { useState, useMemo } from 'react';
import { Layout, SearchInput } from 'ui/components/shared';
import {
  Box,
  IconButton,
  Fade,
  Collapse,
  Tooltip,
  Stack,
  Divider,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import ChannelResults from './ChannelResults';
import ChannelCard from './ChannelCard';
import { Channel } from 'types';
import { useAppDispatch, useAppSelector } from 'store';
import { selectChannels } from 'store/selectors/channels';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToFirstScrollableAncestor,
} from '@dnd-kit/modifiers';
import { moveChannel } from 'store/reducers/channels';
import { downloadFile } from 'helpers/file';
import { NoChannels } from './NoChannels';

interface ChannelsProps {}

export function Channels(props: ChannelsProps) {
  const [search, setSearch] = useState('');
  const [showDragHandles, setShowDragHandles] = useState(false);
  const channels = useAppSelector(selectChannels);
  const dispatch = useAppDispatch();
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

  const renderChannels = useMemo(() => {
    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      if (active.id !== over?.id) {
        const from = channels.findIndex((c: Channel) => c.id === active.id);
        const to = channels.findIndex((c: Channel) => c.id === over?.id);
        dispatch(moveChannel({ from, to }));
      }
    };

    return (
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={channels}
          strategy={verticalListSortingStrategy}
        >
          <Stack sx={{ px: 3, overflow: 'auto' }} divider={<Divider />}>
            {channels.map((channel: Channel, index: number) => (
              <ChannelCard
                key={index}
                channel={channel}
                showDragHandle={showDragHandles}
              />
            ))}
          </Stack>
        </SortableContext>
      </DndContext>
    );
  }, [channels, showDragHandles, dispatch]);

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
        renderChannels
      ) : (
        <NoChannels />
      )}
    </Layout>
  );
}

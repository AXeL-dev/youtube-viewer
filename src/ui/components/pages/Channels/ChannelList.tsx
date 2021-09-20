import React, { useState } from 'react';
import { Stack, Divider } from '@mui/material';
import ChannelCard from './ChannelCard';
import DraggableChannelCard from './ChannelCard/DraggableCard';
import { useAppDispatch } from 'store';
import {
  DndContext,
  closestCenter,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToFirstScrollableAncestor,
} from '@dnd-kit/modifiers';
import { moveChannel } from 'store/reducers/channels';
import { Channel } from 'types';

interface ChannelListProps {
  channels: Channel[];
  showDragHandles?: boolean;
}

function ChannelList(props: ChannelListProps) {
  const { channels, showDragHandles } = props;
  const [draggedChannel, setDraggedChannel] = useState<Channel | null>(null);
  const dispatch = useAppDispatch();

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setDraggedChannel(active.data.current?.channel);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const from = channels.findIndex((c: Channel) => c.id === active.id);
      const to = channels.findIndex((c: Channel) => c.id === over?.id);
      dispatch(moveChannel({ from, to }));
    }
    setDraggedChannel(null);
  };

  return (
    <>
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={channels}
          strategy={verticalListSortingStrategy}
        >
          <Stack sx={{ px: 3, overflow: 'auto' }} divider={<Divider />}>
            {channels.map((channel: Channel, index: number) => (
              <DraggableChannelCard
                key={index}
                channel={channel}
                showDragHandle={showDragHandles}
              />
            ))}
          </Stack>
        </SortableContext>
        <DragOverlay>
          {draggedChannel ? (
            <ChannelCard channel={draggedChannel} isOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}

export default React.memo(ChannelList);

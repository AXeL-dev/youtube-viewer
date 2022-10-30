import React, { useState } from 'react';
import { Box } from '@mui/material';
import ChannelCard from '../ChannelCard';
import DraggableChannelCard from '../ChannelCard/DraggableCard';
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
import { Channel, Nullable } from 'types';
import VirtualList from 'react-tiny-virtual-list';
import AutoSizer from 'react-virtualized-auto-sizer';

interface ChannelListProps {
  channels: Channel[];
  showDragHandles?: boolean;
}

function ChannelList(props: ChannelListProps) {
  const { channels, showDragHandles } = props;
  const [draggedChannel, setDraggedChannel] = useState<Nullable<Channel>>(null);
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
          <Box sx={{ flex: 1 }}>
            <AutoSizer>
              {({ width, height }) => (
                <VirtualList
                  width={width}
                  height={height}
                  itemCount={channels.length}
                  itemSize={98}
                  overscanCount={5}
                  stickyIndices={
                    draggedChannel
                      ? [
                          channels.findIndex(
                            (channel) => channel.id === draggedChannel.id,
                          ),
                        ]
                      : undefined
                  }
                  renderItem={({ index, style }) => (
                    <DraggableChannelCard
                      key={index}
                      style={style}
                      channel={channels[index]}
                      showDragHandle={showDragHandles}
                      hasDivider={index < channels.length - 1}
                      //enablePictureTransition={!isScrolling}
                    />
                  )}
                />
              )}
            </AutoSizer>
          </Box>
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

function propsAreEqual(
  prevProps: ChannelListProps,
  nextProps: ChannelListProps,
) {
  return (
    prevProps.showDragHandles === nextProps.showDragHandles &&
    JSON.stringify(prevProps.channels) === JSON.stringify(nextProps.channels)
  );
}

export default React.memo(ChannelList, propsAreEqual);

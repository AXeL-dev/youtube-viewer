import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ChannelCard, { ChannelCardProps } from '.';

export default function DraggableCard(props: ChannelCardProps) {
  const { channel, ...rest } = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
  } = useSortable({
    id: channel.id,
    data: { channel },
  });

  const style = {
    transition: isSorting ? transition : 'none',
    opacity: isDragging ? 0.5 : 1,
    transform: CSS.Transform.toString(transform),
  } as React.CSSProperties;

  return (
    <ChannelCard
      ref={setNodeRef}
      channel={channel}
      style={style}
      listeners={listeners}
      {...attributes}
      {...rest}
    />
  );
}

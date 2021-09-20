import React from 'react';
import { Box, Paper, Card, CardHeader, Collapse } from '@mui/material';
import { Channel } from 'types';
import ChannelPicture from './ChannelPicture';
import ChannelTitle from './ChannelTitle';
import { DraggableSyntheticListeners } from '@dnd-kit/core';
import ChannelActions from './ChannelActions';
import DragHandle from './DragHandle';

export interface ChannelCardProps {
  channel: Channel;
  style?: React.CSSProperties;
  isOverlay?: boolean;
  showDragHandle?: boolean;
  listeners?: DraggableSyntheticListeners;
}

const ChannelCard = React.forwardRef(
  (props: ChannelCardProps, ref: React.LegacyRef<HTMLDivElement>) => {
    const { channel, isOverlay, showDragHandle, listeners, ...rest } = props;

    const renderCard = React.useMemo(
      () => (
        <Card elevation={0} sx={{ flexGrow: 1, bgcolor: 'transparent' }}>
          <CardHeader
            sx={{
              pt: 2.5,
              pl: 0,
              pr: 1,
              '& .MuiCardHeader-title': {
                fontSize: '0.975rem',
                mb: 0.25,
              },
              '& .MuiCardHeader-action': {
                ml: 2,
              },
              ...(channel.isHidden
                ? {
                    '& .MuiCardHeader-avatar': {
                      opacity: 0.5,
                    },
                    '& .MuiCardHeader-content': {
                      textDecoration: 'line-through',
                      opacity: 0.5,
                    },
                  }
                : {}),
            }}
            avatar={<ChannelPicture channel={channel} />}
            action={<ChannelActions channel={channel} />}
            title={<ChannelTitle channel={channel} />}
            subheader={channel.description}
          />
        </Card>
      ),
      [channel]
    );

    return (
      <div ref={ref} {...rest}>
        <Paper elevation={isOverlay ? 1 : 0}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'background.default',
            }}
          >
            {isOverlay ? (
              <DragHandle />
            ) : (
              <Collapse in={showDragHandle} orientation="horizontal">
                <DragHandle {...listeners} />
              </Collapse>
            )}
            {renderCard}
          </Box>
        </Paper>
      </div>
    );
  }
);

export default React.memo(ChannelCard);

import React from 'react';
import { Box, Paper, Card, CardHeader, Collapse, Divider } from '@mui/material';
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
  hasDivider?: boolean;
  enablePictureTransition?: boolean;
}

const ChannelCard = React.forwardRef(
  (props: ChannelCardProps, ref: React.ForwardedRef<HTMLElement>) => {
    const {
      channel,
      isOverlay,
      showDragHandle,
      listeners,
      hasDivider = true,
      enablePictureTransition = true,
      ...rest
    } = props;

    const renderCard = React.useMemo(
      () => (
        <Card elevation={0} sx={{ flexGrow: 1, bgcolor: 'transparent' }}>
          <CardHeader
            sx={{
              pl: 0,
              pr: 1,
              '& .MuiCardHeader-title': {
                fontSize: '0.975rem',
                mb: 0.25,
              },
              '& .MuiCardHeader-action': {
                alignSelf: 'center',
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
            avatar={
              <ChannelPicture
                channel={channel}
                enableTransition={enablePictureTransition}
              />
            }
            action={<ChannelActions channel={channel} />}
            title={<ChannelTitle channel={channel} />}
            subheader={channel.description}
          />
        </Card>
      ),
      [channel, enablePictureTransition],
    );

    return (
      <Box sx={{ px: 3 }} ref={ref} {...rest}>
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
        {hasDivider ? <Divider /> : null}
      </Box>
    );
  },
);

export default ChannelCard;

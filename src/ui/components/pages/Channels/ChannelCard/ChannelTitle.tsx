import React from 'react';
import { Box, Link, Tooltip } from '@mui/material';
import { Channel } from 'types';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

interface ChannelTitleProps {
  channel: Channel;
}

function ChannelTitle(props: ChannelTitleProps) {
  const { channel } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Link
        sx={{
          color: 'text.primary',
          textDecoration: 'none',
        }}
        href={channel.url}
        target="_blank"
        rel="noopener"
      >
        {channel.title}
      </Link>
      {channel.notifications?.isDisabled && (
        <Tooltip title="Notifications disabled">
          <NotificationsOffIcon color="disabled" fontSize="small" />
        </Tooltip>
      )}
      {!!channel.filters?.length && (
        <Tooltip title="Has filters">
          <FilterAltIcon color="disabled" fontSize="small" />
        </Tooltip>
      )}
    </Box>
  );
}

function propsAreEqual(
  prevProps: ChannelTitleProps,
  nextProps: ChannelTitleProps
) {
  return (
    prevProps.channel.title === nextProps.channel.title &&
    prevProps.channel.url === nextProps.channel.url &&
    prevProps.channel.notifications?.isDisabled ===
      nextProps.channel.notifications?.isDisabled &&
    prevProps.channel.filters?.length === nextProps.channel.filters?.length
  );
}

export default React.memo(ChannelTitle, propsAreEqual);

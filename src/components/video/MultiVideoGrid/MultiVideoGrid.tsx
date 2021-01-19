import React from 'react';
import { Box, Typography, Breadcrumbs, Link, Avatar, Divider, Tooltip, IconButton } from '@material-ui/core';
import { YouTubeIcon, MoreHorizIcon, VisibilityOffIcon, NotificationsActiveIcon, NotificationsOffIcon } from './MultiVideoGrid.icons';
import { useTheme } from '@material-ui/core/styles';
import { Video, Channel, Settings } from '../../../models';
import { VideoGrid } from '..';
import { isWebExtension } from '../../../helpers/browser';
import { useStyles } from './MultiVideoGrid.styles';

interface MultiVideoGridProps {
  loading?: boolean;
  channels: Channel[];
  videos: Video[];
  settings: Settings;
  maxPerChannel?: number;
  maxVisible?: number;
  onSelect: Function;
  onSave: Function;
  onRefresh: Function;
}

export function MultiVideoGrid(props: MultiVideoGridProps) {
  const classes = useStyles();
  const theme = useTheme();
  const { channels, videos, settings, loading = false, maxPerChannel = 9, maxVisible = 3, onSelect, onSave, onRefresh } = props;
  const [expandedChannelsIndexes, setExpandedChannelsIndexes] = React.useState<number[]>([]);

  const hideChannel = (index: number) => {
    channels[index].isHidden = true;
    onSave([...channels]);
    onRefresh();
  };

  const disableChannelNotifications = (index: number) => {
    toggleChannelNotifications(index, false);
  };

  const enableChannelNotifications = (index: number) => {
    toggleChannelNotifications(index, true);
  };

  const toggleChannelNotifications = (index: number, activate: boolean) => {
    channels[index].notifications = {
      ...channels[index].notifications,
      isDisabled: !activate
    };
    onSave([...channels]);
  };

  const onChannelNameClick = (event: any, channel: Channel, index: number) => {
    if (!settings?.openChannelsOnNameClick) {
      event.preventDefault();
      onSelect(channel, index);
    }
  };

  return (
    <Box overflow="hidden" className={classes.box}>
      {channels.map((channel: Channel, index: number) => {
        if (channel.isHidden) {
          // eslint-disable-next-line
          return;
        }
        const channelVideos: Video[] = videos.filter((video: Video) => video.channelId === channel.id);
        // hide empty channels
        if (!loading && settings.hideEmptyChannels && channelVideos.length === 0) {
          // eslint-disable-next-line
          return;
        }
        return (
          <Box key={index}>
            <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumb}>
              <Link color="inherit" className={classes.link} href={channel.url} target="_blank" rel="noopener" onClick={(event: any) => onChannelNameClick(event, channel, index)}>
                <Avatar alt={channel.title} src={channel.thumbnail} />
                <Typography variant="subtitle1" color="textPrimary" className={classes.title}>
                  {channel.title}
                </Typography>
              </Link>
              {!settings?.openChannelsOnNameClick && (
                <Link color="inherit" className={`${classes.link} ${classes.youtube}`} href={channel.url} target="_blank" rel="noopener">
                  <Tooltip title="Open channel" aria-label="open-channel">
                    <YouTubeIcon />
                  </Tooltip>
                </Link>
              )}
              <IconButton size="small" className={classes.link} onClick={() => hideChannel(index)}>
                <Tooltip title="Hide channel" aria-label="hide-channel">
                  <VisibilityOffIcon />
                </Tooltip>
              </IconButton>
              {isWebExtension() && settings.enableRecentVideosNotifications && (channel.notifications?.isDisabled ? (
                <IconButton size="small" className={classes.link} onClick={() => enableChannelNotifications(index)}>
                  <Tooltip title="Enable notifications" aria-label="enable-channel-notifiactions">
                    <NotificationsActiveIcon />
                  </Tooltip>
                </IconButton>
              ) : (
                <IconButton size="small" className={classes.link} onClick={() => disableChannelNotifications(index)}>
                  <Tooltip title="Disable notifications" aria-label="disable-channel-notifiactions">
                    <NotificationsOffIcon />
                  </Tooltip>
                </IconButton>
              ))}
            </Breadcrumbs>
            <VideoGrid
              videos={expandedChannelsIndexes.indexOf(index) > -1 ? channelVideos : channelVideos.slice(0, maxVisible)}
              loading={loading}
              maxPerChannel={maxPerChannel}
              maxSkeletons={maxVisible}
            />
            {channelVideos.length > maxVisible && expandedChannelsIndexes.indexOf(index) === -1 && (
              <Tooltip title="Show more" aria-label="show-more">
                <IconButton edge="end" aria-label="show-more" size="small" style={{ marginBottom: theme.spacing(2.5) }} onClick={() => setExpandedChannelsIndexes([...expandedChannelsIndexes, index])}>
                  <MoreHorizIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Divider className={`divider ${classes.divider}`} />
          </Box>
      )}
    )}
    </Box>
  );
}

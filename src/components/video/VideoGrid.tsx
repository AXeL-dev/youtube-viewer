import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import YouTubeIcon from '@material-ui/icons/YouTube';
import Link from '@material-ui/core/Link';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Tooltip from '@material-ui/core/Tooltip';
import { Video } from '../../models/Video';
import { Channel } from '../../models/Channel';
import VideoList from './VideoList';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

const useStyles = makeStyles((theme: Theme) => ({
  breadcrumb: {
    marginBottom: theme.spacing(2.5),
  },
  divider: {
    marginBottom: theme.spacing(2.5),
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    outline: 'none',
    '&:hover': {
      backgroundColor: 'transparent'
    },
  },
  title: {
    marginLeft: theme.spacing(1),
  },
  youtube: {
    '& :hover': {
      color: '#f44336',
    },
  }
}));

interface VideoGridProps {
  loading?: boolean;
  channels: Channel[];
  videos: Video[];
  maxPerLine?: number;
  maxPerChannel?: number;
  onSelect: Function;
  onVideoClick: Function;
  onSave: Function;
  onRefresh: Function;
}

export default function VideoGrid(props: VideoGridProps) {
  const classes = useStyles();
  const theme = useTheme();
  const { channels, videos, loading = false, maxPerLine = 3, maxPerChannel = 6, onSelect, onVideoClick, onSave, onRefresh } = props;
  const [expandedIndexes, setExpandedIndexes] = React.useState<number[]>([]);

  const hideChannel = (channel: Channel) => {
    channels.forEach((c: Channel) => {
      if (c.id === channel.id) {
        c.isHidden = true;
        onSave([...channels]);
        onRefresh();
        return;
      }
    });
  };

  return (
    <Box overflow="hidden">
      {channels.filter((channel: Channel) => !channel.isHidden).map((channel: Channel, index: number) => {
        const channelVideos: Video[] = videos.filter((video: Video) => video.channelId === channel.id);
        return (
          <Box key={index}>
            <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumb}>
              <Link color="inherit" className={classes.link} onClick={() => onSelect(channel, index)}>
                <Avatar alt={channel.title} src={channel.thumbnail} />
                <Typography variant="subtitle1" color="textPrimary" className={classes.title}>
                  {channel.title}
                </Typography>
              </Link>
              <Link color="inherit" className={`${classes.link} ${classes.youtube}`} href={channel.url} target="_blank" rel="noopener">
                <Tooltip title="Open channel" aria-label="open-channel">
                  <YouTubeIcon />
                </Tooltip>
              </Link>
              <IconButton color="inherit" className={classes.link} onClick={() => hideChannel(channel)}>
                <Tooltip title="Hide channel" aria-label="hide-channel">
                  <VisibilityOffIcon />
                </Tooltip>
              </IconButton>
            </Breadcrumbs>
            <VideoList videos={channelVideos.slice(0, 3)} loading={loading} maxPerLine={maxPerLine} maxPerChannel={3} onVideoClick={onVideoClick} />
            {channelVideos.length > 3 && 
              <React.Fragment>
                {expandedIndexes.indexOf(index) > -1 ? (
                  <VideoList videos={channelVideos.slice(3)} loading={loading} maxPerLine={maxPerLine} maxPerChannel={maxPerChannel} onVideoClick={onVideoClick} />
                ) : (
                  <Tooltip title="Show more" aria-label="show-more">
                    <IconButton edge="end" aria-label="show-more" size="small" style={{ marginBottom: theme.spacing(2.5) }} onClick={() => setExpandedIndexes([...expandedIndexes, index])}>
                      <MoreHorizIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </React.Fragment>
            }
            {index < channels.length - 1 && <Divider className={classes.divider} />}
          </Box>
      )}
    )}
    </Box>
  );
}

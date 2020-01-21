import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import Link from '@material-ui/core/Link';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import { Video } from '../../models/Video';
import { Channel } from '../../models/Channel';
import VideoList from './VideoList';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    width: '100%',
    height: '80vh',
    justifyContent: 'center',
  },
  centered: {
    alignSelf: 'center',
    textAlign: 'center',
    margin: '0 80px'
  },
  breadcrumb: {
    marginBottom: theme.spacing(2.5),
  },
  divider: {
    marginBottom: theme.spacing(2.5),
  },
  typo: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'default',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 30,
    height: 30,
  }
}));

interface VideoGridProps {
  loading?: boolean;
  channels: Channel[];
  videos: Video[];
  maxPerLine?: number;
  //maxPerChannel?: number;
  onSelect: Function;
}

export default function VideoGrid(props: VideoGridProps) {
  const classes = useStyles();
  const { channels, videos, loading = false, maxPerLine = 3, onSelect } = props;

  return (
    <Box overflow="hidden">
      {channels?.length ? (
        channels.map((channel: Channel, index: number) => (
          <Box key={index}>
            <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumb}>
              <Typography color="textPrimary" className={classes.typo}>
                <SubscriptionsIcon className={classes.icon} />
              </Typography>
              <Link color="inherit" onClick={() => onSelect(channel, index)} className={classes.link}>
                <Avatar className={classes.icon} alt={channel.title} src={channel.thumbnail} />
                <Typography variant="subtitle2">
                  {channel.title}
                </Typography>
              </Link>
            </Breadcrumbs>
            <VideoList videos={videos.filter((video: Video) => video.channelId === channel.id)} loading={loading} maxPerLine={maxPerLine} />
            {index < channels.length - 1 && <Divider className={classes.divider} />}
          </Box>
        ))
      ) : (
        <Box className={classes.container}>
          <Typography component="div" variant="h5" color="textSecondary" className={classes.centered} style={{ cursor: 'default' }}>
            <PlaylistAddIcon style={{ fontSize: 40, verticalAlign: 'middle' }} /> Start by typing a channel name in the search box
          </Typography>
        </Box>
      )}
    </Box>
  );
}

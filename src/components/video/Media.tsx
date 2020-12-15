import React from 'react';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { Video } from '../../models/Video';
import { TimeAgo } from '../../helpers/utils';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import { ChannelSelection } from '../../models/Channel';
import { useStyles } from './Media.styles';

interface MediaProps {
  item: Video;
  selectedChannelIndex: number;
  onClick: Function;
  onWatchLaterClick: Function;
}

export default function Media(props: MediaProps) {
  const { item, selectedChannelIndex, onClick, onWatchLaterClick } = props;
  const classes = useStyles();

  return (
    <Link href={item.url} className={classes.anchor} target="_blank" rel="noopener" onClick={(event: any) => onClick(event, item)}>
      <Box className={classes.imageContainer}>
        <img className={classes.image} alt="" src={item.thumbnail} />
        <Box className={`${classes.overlay} overlay`}></Box>
        <Box className={`${classes.options} options`}>
          {selectedChannelIndex !== ChannelSelection.WatchLaterVideos && 
          <IconButton size="small" className={classes.optionsButton} onClick={(event: any) => onWatchLaterClick(event, item)}>
            <Tooltip title="Watch later" aria-label="watch-later">
              <WatchLaterIcon className={classes.optionsIcon} />
            </Tooltip>
          </IconButton>}
          <IconButton size="small" className={classes.optionsButton}>
            <Tooltip title="Watch now" aria-label="watch-now">
              <PlayArrowIcon className={`${classes.optionsIcon} bigger`} />
            </Tooltip>
          </IconButton>
        </Box>
        <Typography variant="caption" className={classes.duration}>
          {item.duration}
        </Typography>
      </Box>
      <Box pr={2} mt={1}>
        <Typography gutterBottom variant="body2">
          {item.title}
        </Typography>
        <Typography display="block" variant="caption" color="textSecondary">
          {item.channelTitle}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {`${item.views.asString || item.views} • ${TimeAgo.inWords(item.publishedAt)}`}
        </Typography>
      </Box>
    </Link>
  );
}

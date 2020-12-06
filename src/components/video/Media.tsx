import React from 'react';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { Video } from '../../models/Video';
import { TimeAgo } from '../../helpers/utils';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import { ChannelSelection } from '../../models/Channel';

const useStyles = makeStyles((theme: Theme) => ({
  anchor: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'inline-block',
    '&:hover': {
      textDecoration: 'none',
    }
  },
  imageContainer: {
    position: 'relative',
    '&:hover .overlay': {
      opacity: 1,
    },
    '&:hover .options': {
      top: '50%',
      left: '50%',
      opacity: 1,
    }
  },
  image: {
    width: 210,
    height: 118,
    display: 'inherit'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    position: 'absolute',
    height: '99%',
    width: '100%',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    opacity: 0,
    transition: 'all 0.4s ease-in-out 0s',
  },
  options: {
    position: 'absolute',
    textAlign: 'center',
    paddingLeft: '1em',
    paddingRight: '1em',
    width: '100%',
    top: '50%',
    left: '50%',
    opacity: 0,
    transform: 'translate(-50%, -50%)',
    transition: 'all 0.3s ease-in-out 0s',
  },
  optionsButton: {
    color: '#fff',
    margin: theme.spacing(0.5),
  },
  optionsIcon: {
    fontSize: '1.6em',
    //verticalAlign: 'middle',
    '&.bigger': {
      fontSize: '2.2em',
    }
  },
  duration: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: '4px',
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: '2px 4px',
    borderRadius: '2px'
  }
}));

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

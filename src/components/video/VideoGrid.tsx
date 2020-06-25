import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/lab/Skeleton';
import { Video } from '../../models/Video';
import Media from './Media';

interface VideoGridProps {
  loading?: boolean;
  videos: Video[];
  maxPerChannel?: number;
  maxSkeletons?: number;
  onVideoClick: Function;
}

export default function VideoGrid(props: VideoGridProps) {
  const { videos, loading = false, maxPerChannel = 9, maxSkeletons = 9, onVideoClick } = props;
  const style = {
    grid: {
      minWidth: '428px'
    }
  };

  const cancelEvent = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    return false;
  };

  return (
    <Grid container style={style.grid}>
      {(loading ? Array.from(new Array(Math.min(maxPerChannel, maxSkeletons))) : videos.slice(0, maxPerChannel)).map((item, index) => (
        <Box key={index} width={210} marginRight={0.5} marginBottom={3} draggable="false" onMouseDown={(event: any) => cancelEvent(event)}>
          {item ? (
            <Media item={item} onClick={onVideoClick}></Media>
          ) : (
            <React.Fragment>
              <Skeleton variant="rect" width={210} height={118} />
              <Box pt={0.5}>
                <Skeleton />
                <Skeleton width="60%" />
              </Box>
            </React.Fragment>
          )}
        </Box>
      ))}
    </Grid>
  );
}

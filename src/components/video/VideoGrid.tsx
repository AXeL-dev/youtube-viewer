import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/lab/Skeleton';
import { Video } from '../../models';
import { VideoRenderer } from '.';
import { debug } from '../../helpers/debug';
import { styles } from './VideoGrid.styles';
import { videoImageSize } from './VideoRenderer.styles';

interface VideoGridProps {
  loading?: boolean;
  videos: Video[];
  maxPerChannel?: number;
  maxSkeletons?: number;
}

export function VideoGrid(props: VideoGridProps) {
  const { videos, loading = false, maxPerChannel = 9, maxSkeletons = 9 } = props;
  const [preventLongPress, setPreventLongPress] = React.useState(false);
  let timeout: any = null;

  const handleMouseEvent = (event: any) => {
    debug.log(event.type, { preventLongPress: preventLongPress });
    if (event.type === 'mousedown') {
      setPreventLongPress(false); // always reset preventLongPress state on mousedown
      timeout = setTimeout(() => {
        // delay of 200 ms used here to wait for the click event
        // if it fires immediately after the mousedown event then preventLongPress value will be false, otherwise it's probably a long press click
        setPreventLongPress(true);
      }, 200);
    } else {
      if (!preventLongPress) {
        return true;
      }
      setPreventLongPress(false);
    }
    event.stopPropagation();
    event.preventDefault();
    return false;
  };

  React.useEffect(() => {
    return () => { // equivalent to componentWillUnmount
      if (timeout) {
        clearTimeout(timeout); // Fix warning: Can't perform a React state update on an unmounted component.
      }
    };
  });

  return (
    <Grid container style={styles.grid} onMouseDown={(event: any) => handleMouseEvent(event)} onClickCapture={(event: any) => handleMouseEvent(event)}>
      {(loading ? Array.from(new Array(Math.min(maxPerChannel, maxSkeletons))) : videos.slice(0, maxPerChannel)).map((video, index) => (
        <Box key={index} width={videoImageSize.width} marginRight={0.5} marginBottom={3} draggable="false">
          {video ? (
            <VideoRenderer video={video} ></VideoRenderer>
          ) : (
            <React.Fragment>
              <Skeleton variant="rect" width={videoImageSize.width} height={videoImageSize.height} />
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

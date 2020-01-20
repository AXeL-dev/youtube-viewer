import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Video } from '../../models/Video';
import Media from './Media';

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
}));

interface VideoListProps {
  loading?: boolean;
  videos: Video[];
}

export default function VideoList(props: VideoListProps) {
  const classes = useStyles();
  const { videos, loading = false } = props;
  const maxVideosPerLine: number = 3;

  return (
    <Box overflow="hidden">
      {loading ? (
        <React.Fragment>
          <Media loading maxPerLine={maxVideosPerLine} />
          <Media loading maxPerLine={maxVideosPerLine} />
        </React.Fragment>
      ) : videos?.length ? (
        walk(videos, maxVideosPerLine, (data: Video[], index: number) => {
          //console.log('data', data);
          return (<Media key={index} data={data} maxPerLine={maxVideosPerLine} />);
        })
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

function walk(arr: any[], n: number, fn: Function): any {
  let output: any = [];
  for (let i = 0; i < arr.length; i += n) {
    let end = i + n;
    if (end > arr.length) {
      end = arr.length;
    }
    output.push(
      fn(arr.slice(i, end), i)
    );
  }
  return output;
}

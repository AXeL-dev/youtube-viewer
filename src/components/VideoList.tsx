import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Video } from '../models/Video';

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

interface MediaProps {
  loading?: boolean;
  data?: Video[];
  maxPerLine: number;
}

function Media(props: MediaProps) {
  const { loading = false, data = [], maxPerLine } = props;
  const style = {
    anchor: {
      textDecoration: 'none',
      color: 'inherit',
      display: 'inline-block'
    }
  };

  return (
    <Grid container wrap="nowrap">
      {(loading ? Array.from(new Array(maxPerLine)) : data).map((item, index) => (
        <Box key={index} width={210} marginRight={0.5} marginBottom={3}>
          {item ? (
            <a href={item.url} style={style.anchor} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()}>
              <img style={{ width: 210, height: 118 }} alt={item.title} src={item.thumbnails.medium.url} />
              <Box pr={2}>
                <Typography gutterBottom variant="body2">
                  {item.title}
                </Typography>
                <Typography display="block" variant="caption" color="textSecondary">
                  {item.channelTitle}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {`${item.views} • ${item.publishedAt}`}
                </Typography>
              </Box>
            </a>
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

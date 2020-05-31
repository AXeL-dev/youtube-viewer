import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import { Video } from '../../models/Video';
import { TimeAgo } from '../../helpers/utils';

interface MediaProps {
  loading?: boolean;
  data?: Video[];
  maxPerLine: number;
  onClick: Function;
}

export default function Media(props: MediaProps) {
  const { loading = false, data = [], maxPerLine, onClick } = props;
  const style = {
    anchor: {
      textDecoration: 'none',
      color: 'inherit',
      display: 'inline-block'
    },
    imageContainer: {
      position: 'relative'
    } as React.CSSProperties,
    image: {
      width: 210,
      height: 118,
      display: 'inherit'
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
    } as React.CSSProperties
  };

  return (
    <Grid container wrap="nowrap">
      {(loading ? Array.from(new Array(maxPerLine)) : data).map((item, index) => (
        <Box key={index} width={210} marginRight={0.5} marginBottom={3}>
          {item ? (
            <Link href={item.url} style={style.anchor} target="_blank" rel="noopener" onClick={(event: any) => onClick(event)}>
              <Box style={style.imageContainer}>
                <img style={style.image} alt="" src={item.thumbnail} />
                <Typography variant="caption" style={style.duration}>
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

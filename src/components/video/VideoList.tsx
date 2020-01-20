import React from 'react';
import Box from '@material-ui/core/Box';
import { Video } from '../../models/Video';
import Media from './Media';

interface VideoListProps {
  loading?: boolean;
  videos: Video[];
  maxPerLine?: number;
}

export default function VideoList(props: VideoListProps) {
  const { videos, loading = false, maxPerLine = 3 } = props;

  return (
    <Box overflow="hidden">
      {loading ? (
        <React.Fragment>
          <Media loading maxPerLine={maxPerLine} />
          <Media loading maxPerLine={maxPerLine} />
        </React.Fragment>
      ) : (
        walk(videos, maxPerLine, (data: Video[], index: number) => {
          //console.log('data', data);
          return (<Media key={index} data={data} maxPerLine={maxPerLine} />);
        })
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

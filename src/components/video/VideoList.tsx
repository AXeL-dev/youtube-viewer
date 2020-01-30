import React from 'react';
import Box from '@material-ui/core/Box';
import { Video } from '../../models/Video';
import Media from './Media';

interface VideoListProps {
  loading?: boolean;
  videos: Video[];
  maxPerLine?: number;
  maxPerChannel?: number;
  onVideoClick: Function;
}

export default function VideoList(props: VideoListProps) {
  const { videos, loading = false, maxPerLine = 3, maxPerChannel = 6, onVideoClick } = props;

  const numberOfLines = (): number => (maxPerChannel - restOfLines()) / maxPerLine; // ToDo: review this code for extra-cases

  const restOfLines = (): number => maxPerChannel % maxPerLine;

  return (
    <Box overflow="hidden">
      {loading ? (
        <React.Fragment>
          {Array.from(new Array(numberOfLines())).map((_, index) => (
            <Media key={index} loading maxPerLine={maxPerLine} onClick={onVideoClick} />
          ))}
          {restOfLines() > 0 && <Media loading maxPerLine={restOfLines()} onClick={onVideoClick} />}
        </React.Fragment>
      ) : (
        walk(videos, maxPerLine, (data: Video[], index: number) => {
          //console.log('data', data);
          return (<Media key={index} data={data} maxPerLine={maxPerLine} onClick={onVideoClick} />);
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

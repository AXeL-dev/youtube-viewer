import React from 'react';
import Box from '@mui/material/Box';
import { Alert, ProgressBar } from 'ui/components/shared';
import { useFindChannelByNameQuery } from 'store/services/youtube';
import { Channel } from 'types';
import PickChannelCard from './PickChannelCard';

interface ChannelResultsProps {
  search: string;
}

export default function ChannelResults(props: ChannelResultsProps) {
  const { search } = props;
  const {
    data: results = [],
    error,
    isLoading,
  } = useFindChannelByNameQuery({ name: search }, { skip: search === '' });

  return error ? (
    <Alert error={error} closable />
  ) : isLoading ? (
    <ProgressBar variant="indeterminate" />
  ) : (
    <Box sx={{ px: 3, overflow: 'auto' }}>
      {results.map((channel: Channel, index: number) => (
        <PickChannelCard key={index} channel={channel} />
      ))}
    </Box>
  );
}

import React from 'react';
import { Stack, Divider } from '@mui/material';
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
    <Stack sx={{ px: 3, overflow: 'auto' }} divider={<Divider />}>
      {results.map((channel: Channel, index: number) => (
        <PickChannelCard key={index} channel={channel} />
      ))}
    </Stack>
  );
}

import React from 'react';
import { Stack, Divider } from '@mui/material';
import { Alert, ProgressBar } from 'ui/components/shared';
import { useFindChannelByNameQuery } from 'store/services/youtube';
import PickChannelCard from './PickChannelCard';

interface ChannelResultsProps {
  search: string;
}

export default function ChannelResults(props: ChannelResultsProps) {
  const { search } = props;
  const { data, error, isLoading } = useFindChannelByNameQuery(
    { name: search },
    { skip: search === '' },
  );
  const results = data?.items || [];

  return error ? (
    <Alert error={error} closable />
  ) : isLoading ? (
    <ProgressBar variant="indeterminate" />
  ) : (
    <Stack sx={{ px: 3, overflow: 'auto' }} divider={<Divider />}>
      {results.map((channel, index) => (
        <PickChannelCard key={index} channel={channel} />
      ))}
    </Stack>
  );
}

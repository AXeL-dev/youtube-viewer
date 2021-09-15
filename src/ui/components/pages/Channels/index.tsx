import React from 'react';
import { Layout, SearchInput } from 'ui/components/shared';
import ChannelCard from './common/ChannelCard';
import { useStyles } from './styles';

interface ChannelsProps {}

export function Channels(props: ChannelsProps) {
  const classes = useStyles();

  return (
    <Layout>
      <div className={classes.header}>
        <SearchInput
          placeholder="Search for a channel…"
          onChange={(value: string) => {
            console.log(value);
          }}
        />
      </div>
      <div className={classes.body}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((index: number) => (
          <ChannelCard key={index} />
        ))}
      </div>
    </Layout>
  );
}

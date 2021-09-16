import React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from './Tab';
import { Layout } from 'ui/components/shared';
import { HomeView } from 'models';

interface HomeProps {}

export function Home(props: HomeProps) {
  const [activeTab, setActiveTab] = React.useState(HomeView.All);

  const handleTabChange = (event: React.ChangeEvent<{}>, value: HomeView) => {
    setActiveTab(value);
  };

  return (
    <Layout>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs sx={{ pt: 1, px: 3 }} value={activeTab} onChange={handleTabChange} aria-label="tabs">
            <Tab label="All" value={HomeView.All} />
            <Tab label="Recent" value={HomeView.Recent} />
            <Tab label="Watch later" value={HomeView.WatchLater} />
          </Tabs>
        </Box>
      </Box>
    </Layout>
  );
}

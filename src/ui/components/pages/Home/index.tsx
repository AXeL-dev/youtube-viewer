import React, { useState, ChangeEvent } from 'react';
import { Box, Tabs } from '@mui/material';
import { Layout } from 'ui/components/shared';
import { HomeView } from 'types';
import Tab from './Tab';
import MainView from './MainView';

interface HomeProps {}

export function Home(props: HomeProps) {
  const [activeTab, setActiveTab] = useState(HomeView.All);

  const handleTabChange = (event: ChangeEvent<{}>, value: HomeView) => {
    setActiveTab(value);
  };

  return (
    <Layout>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          sx={{ pt: 1, px: 3 }}
          value={activeTab}
          onChange={handleTabChange}
          aria-label="tabs"
        >
          <Tab label="All" value={HomeView.All} />
          <Tab label="Recent" value={HomeView.Recent} />
          <Tab label="Watch later" value={HomeView.WatchLater} />
        </Tabs>
      </Box>
      <MainView />
    </Layout>
  );
}

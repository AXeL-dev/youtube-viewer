import React, { useState, useEffect, ChangeEvent } from 'react';
import { Box, Tabs } from '@mui/material';
import { Layout } from 'ui/components/shared';
import { HomeView } from 'types';
import Tab from './Tab';
import TabPanel from './TabPanel';
import { useAppSelector } from 'store';
import { selectSettings } from 'store/selectors/settings';
import { selectWatchLaterVideosCount } from 'store/selectors/videos';

interface HomeProps {}

export function Home(props: HomeProps) {
  const settings = useAppSelector(selectSettings);
  const [activeTab, setActiveTab] = useState(settings.defaultView);
  const watchLaterVideosCount = useAppSelector(selectWatchLaterVideosCount);

  useEffect(() => {
    if (activeTab !== settings.defaultView) {
      setActiveTab(settings.defaultView);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.defaultView]);

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
          <Tab
            label="Watch later"
            value={HomeView.WatchLater}
            badge={watchLaterVideosCount}
          />
        </Tabs>
      </Box>
      <TabPanel tab={activeTab} />
    </Layout>
  );
}

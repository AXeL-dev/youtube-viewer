import React, { useState, useEffect, ChangeEvent } from 'react';
import { Box, Tabs } from '@mui/material';
import { Layout } from 'ui/components/shared';
import { HomeView } from 'types';
import Tab from './Tab';
import TabPanel, { RecentVideosCount } from './TabPanel';
import { useAppSelector } from 'store';
import { selectSettings } from 'store/selectors/settings';
import { selectWatchLaterVideosCount } from 'store/selectors/videos';
import TabActions from './TabActions';

interface HomeProps {}

export function Home(props: HomeProps) {
  const settings = useAppSelector(selectSettings);
  const [activeTab, setActiveTab] = useState(settings.defaultView);
  const [recentVideosCount, setRecentVideosCount] = useState<RecentVideosCount>(
    {
      displayed: 0,
      total: 0,
    }
  );
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

  const handleCountChange = (tab: HomeView, count: RecentVideosCount) => {
    if (tab === HomeView.Recent) {
      setRecentVideosCount(count);
    }
  };

  return (
    <Layout>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider',
          gap: 2,
          px: 3,
        }}
      >
        <Tabs
          sx={{ flexGrow: 1, pt: 1 }}
          value={activeTab}
          onChange={handleTabChange}
          aria-label="tabs"
        >
          <Tab label="All" value={HomeView.All} />
          <Tab
            label="Recent"
            value={HomeView.Recent}
            badge={recentVideosCount.displayed}
          />
          <Tab
            label="Watch later"
            value={HomeView.WatchLater}
            badge={watchLaterVideosCount}
          />
        </Tabs>
        <TabActions
          tab={activeTab}
          recentVideosCount={recentVideosCount.total}
        />
      </Box>
      <TabPanel tab={activeTab} onCountChange={handleCountChange} />
    </Layout>
  );
}

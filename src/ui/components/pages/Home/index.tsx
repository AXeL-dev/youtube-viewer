import React, { useState, useEffect, ChangeEvent } from 'react';
import { Box, Tabs } from '@mui/material';
import { Layout } from 'ui/components/shared';
import { HomeView } from 'types';
import Tab from './Tab';
import TabPanel, { RecentVideosCount } from './TabPanel';
import { useAppSelector } from 'store';
import { selectApp } from 'store/selectors/app';
import { selectSettings } from 'store/selectors/settings';
import { selectWatchLaterVideosCount } from 'store/selectors/videos';
import TabActions from './TabActions';

interface HomeProps {}

export function Home(props: HomeProps) {
  const app = useAppSelector(selectApp);
  const settings = useAppSelector(selectSettings);
  const [_activeTab, setActiveTab] = useState(settings.defaultView);
  const [recentVideosCount, setRecentVideosCount] = useState<RecentVideosCount>(
    {
      displayed: 0,
      total: 0,
    },
  );
  const watchLaterVideosCount = useAppSelector(selectWatchLaterVideosCount);
  const { hiddenViews } = settings.homeDisplayOptions;
  const tabs = app.loaded
    ? [
        {
          label: 'All',
          value: HomeView.All,
        },
        {
          label: 'Recent',
          value: HomeView.Recent,
          badge: recentVideosCount.displayed,
        },
        {
          label: 'Watch later',
          value: HomeView.WatchLater,
          badge: watchLaterVideosCount,
        },
      ].filter((tab) => !hiddenViews.includes(tab.value))
    : [];

  const activeTab =
    tabs.length > 0
      ? _activeTab && !hiddenViews.includes(_activeTab)
        ? _activeTab
        : tabs[0].value
      : null;

  useEffect(() => {
    if (_activeTab !== settings.defaultView) {
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
          value={activeTab || false}
          onChange={handleTabChange}
          aria-label="tabs"
        >
          {tabs.map((props, index) => (
            <Tab key={index} {...props} />
          ))}
        </Tabs>
        <TabActions
          tab={activeTab}
          recentVideosCount={recentVideosCount.displayed}
          watchLaterVideosCount={watchLaterVideosCount}
        />
      </Box>
      {activeTab && (
        <TabPanel tab={activeTab} onCountChange={handleCountChange} />
      )}
    </Layout>
  );
}

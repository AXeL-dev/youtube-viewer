import React, { useState, useEffect, ChangeEvent } from 'react';
import { Box } from '@mui/material';
import { Layout } from 'ui/components/shared';
import { HomeView } from 'types';
import Tab from './Tab';
import TabPanel from './TabPanel';
import { useAppSelector } from 'store';
import { selectApp } from 'store/selectors/app';
import { selectSettings } from 'store/selectors/settings';
import Tabs from './StyledTabs';
import TabActions from './TabActions';

interface HomeProps {}

export function Home(props: HomeProps) {
  const app = useAppSelector(selectApp);
  const settings = useAppSelector(selectSettings);
  const [_activeTab, setActiveTab] = useState(settings.defaultView);
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
        },
        {
          label: 'Watch later',
          value: HomeView.WatchLater,
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
          value={activeTab || false}
          onChange={handleTabChange}
          aria-label="tabs"
        >
          {tabs.map((props, index) => (
            <Tab key={index} {...props} />
          ))}
        </Tabs>
        <TabActions tab={activeTab} />
      </Box>
      {activeTab && <TabPanel tab={activeTab} />}
    </Layout>
  );
}

import React from 'react';
import { Layout } from 'ui/components/shared';
import { Tabs, Tab } from 'ui/components/shared';

interface HomeProps {}

export function Home(props: HomeProps) {
  const [activeTab, setActiveTab] = React.useState(0);

  const handleTabChange = (event: React.ChangeEvent<{}>, index: number) => {
    setActiveTab(index);
  };

  return (
    <Layout>
      <Tabs value={activeTab} onChange={handleTabChange} aria-label="tabs">
        <Tab label="All" />
        <Tab label="Recent" />
        <Tab label="Watch later" />
      </Tabs>
    </Layout>
  );
}

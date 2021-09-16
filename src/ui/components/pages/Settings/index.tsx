import React from 'react';
import { Box, Link } from '@mui/material';
import { Layout } from 'ui/components/shared';
import { HomeView, SettingType } from 'models';
import Field from './Field';

interface SettingsProps {}

export function Settings(props: SettingsProps) {
  return (
    <Layout>
      <Box sx={{ px: 3, overflow: 'auto' }}>
        <Field
          label="Default view"
          value={HomeView.All}
          options={[
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
          ]}
          type={SettingType.List}
        />
        <Field label="Dark mode" value={false} type={SettingType.Boolean} />
        <Field
          label="Youtube API key"
          description={
            <span>
              Don't have an API key yet?{' '}
              <Link
                href="https://www.slickremix.com/docs/get-api-key-for-youtube/"
                target="_blank"
                color="secondary"
                rel="noopener"
              >
                Get your own!
              </Link>
            </span>
          }
          value="test"
          type={SettingType.String}
          noBorder
        />
      </Box>
    </Layout>
  );
}

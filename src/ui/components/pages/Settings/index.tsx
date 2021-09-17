import React from 'react';
import { Box, Link } from '@mui/material';
import { Layout } from 'ui/components/shared';
import { HomeView, SettingType } from 'models';
import Field from './Field';
import { useAppDispatch, useAppSelector } from 'store';
import { selectSettings } from 'store/selectors/settings';
import { setSettings } from 'store/reducers/settings';

interface SettingsProps {}

export function Settings(props: SettingsProps) {
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();

  return (
    <Layout>
      <Box sx={{ px: 3, overflow: 'auto' }}>
        <Field
          label="Default view"
          value={settings.defaultView}
          onChange={(defaultView: HomeView) => {
            dispatch(setSettings({ defaultView }));
          }}
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
        <Field
          label="Dark mode"
          value={settings.darkMode}
          onChange={(darkMode: boolean) => {
            dispatch(setSettings({ darkMode }));
          }}
          type={SettingType.Boolean}
        />
        <Field
          label="Youtube API key"
          placeholder="__________-______-_____________________"
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
          value={settings.apiKey}
          onChange={(apiKey: string) => {
            dispatch(setSettings({ apiKey }));
          }}
          type={SettingType.String}
          noBorder
        />
      </Box>
    </Layout>
  );
}

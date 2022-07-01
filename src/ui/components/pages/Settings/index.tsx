import React, { useState, useEffect, useMemo } from 'react';
import { Stack, Divider, Link } from '@mui/material';
import { Layout } from 'ui/components/shared';
import { HomeView, SettingType, VideosSeniority } from 'types';
import { ControlledField, CustomField } from './Field';
import { useAppDispatch, useAppSelector } from 'store';
import { selectSettings } from 'store/selectors/settings';
import { setSettings } from 'store/reducers/settings';
import Alerts from './Alerts';
import { isWebExtension, sendMessage } from 'helpers/webext';
import {
  humanInterval,
  TimeAgo,
  memorySizeOf,
  formatByteSize,
} from 'helpers/utils';
import { defaults as channelCheckerDefaults } from 'ui/components/webext/Background/ChannelChecker';
import { selectVideos } from 'store/selectors/videos';
import SavedVideosOptions from './SavedVideosOptions';

interface SettingsProps {}

const views = [
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
];

export function Settings(props: SettingsProps) {
  const [lastCheckTime, setLastCheckTime] = useState(null);
  const settings = useAppSelector(selectSettings);
  const videos = useAppSelector(selectVideos);
  const savedVideosSize = memorySizeOf(videos);
  const dispatch = useAppDispatch();

  const activeViews = useMemo(
    () =>
      views.filter(
        ({ value }) => !settings.homeDisplayOptions.hiddenViews.includes(value)
      ),
    [settings.homeDisplayOptions.hiddenViews]
  );

  useEffect(() => {
    if (isWebExtension) {
      sendMessage('getLastCheckDate').then((date: string) => {
        if (date) {
          const time = new Date(date).getTime();
          setLastCheckTime(TimeAgo.inWords(time));
        }
      });
    }
  }, []);

  return (
    <Layout>
      <Alerts settings={settings} />
      <Stack sx={{ px: 3, overflow: 'auto' }} divider={<Divider />}>
        <ControlledField
          label="Default view"
          value={settings.defaultView}
          onChange={(defaultView: HomeView) => {
            dispatch(setSettings({ defaultView }));
          }}
          options={activeViews}
          type={SettingType.List}
        />
        <ControlledField
          label="Recent videos seniority"
          value={settings.recentVideosSeniority}
          onChange={(recentVideosSeniority: VideosSeniority) => {
            dispatch(setSettings({ recentVideosSeniority }));
          }}
          options={[
            {
              label: '1 day',
              value: VideosSeniority.OneDay,
            },
            {
              label: '3 days',
              value: VideosSeniority.ThreeDays,
            },
            {
              label: '7 days',
              value: VideosSeniority.SevenDays,
            },
            {
              label: '2 weeks',
              value: VideosSeniority.TwoWeeks,
            },
            {
              label: '1 month',
              value: VideosSeniority.OneMonth,
            },
          ]}
          type={SettingType.List}
        />
        <ControlledField
          label="Dark mode"
          value={settings.darkMode}
          onChange={(darkMode: boolean) => {
            dispatch(setSettings({ darkMode }));
          }}
          type={SettingType.Boolean}
        />
        <ControlledField
          label="Auto play videos"
          value={settings.autoPlayVideos}
          onChange={(autoPlayVideos: boolean) => {
            dispatch(setSettings({ autoPlayVideos }));
          }}
          type={SettingType.Boolean}
        />
        {isWebExtension ? (
          <ControlledField
            label="Enable notifications"
            description={`Checking for new videos is performed every ${humanInterval(
              channelCheckerDefaults.checkInterval,
              'minute'
            )}${lastCheckTime ? ` (Last check: ${lastCheckTime})` : ''}`}
            value={settings.enableNotifications}
            onChange={(enableNotifications: boolean) => {
              dispatch(setSettings({ enableNotifications }));
            }}
            type={SettingType.Boolean}
          />
        ) : null}
        <ControlledField
          label="Youtube API key"
          description={
            <span>
              Don't have an API key yet?{' '}
              <Link
                href="https://github.com/AXeL-dev/youtube-viewer/wiki/How-to-Create-a-YouTube-API-Key"
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
          type={SettingType.Secret}
        />
        {savedVideosSize > 0 ? (
          <CustomField
            label="Saved videos data"
            description={`Estimated size: ${formatByteSize(savedVideosSize)}`}
            render={() => <SavedVideosOptions videos={videos} />}
          />
        ) : null}
      </Stack>
    </Layout>
  );
}

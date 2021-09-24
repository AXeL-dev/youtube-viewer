import React, { MouseEvent } from 'react';
import { Link } from '@mui/material';
import { Alert } from 'ui/components/shared';
import { useAppDispatch } from 'store';
import { setSettings, SettingsState } from 'store/reducers/settings';

const { REACT_APP_YOUTUBE_API_KEY: temporaryApiKey } = process.env;

interface AlertsProps {
  settings: SettingsState;
}

export default function Alerts(props: AlertsProps) {
  const { settings } = props;
  const dispatch = useAppDispatch();

  const handleUseTemporaryKey = (event: MouseEvent) => {
    event.preventDefault();
    dispatch(setSettings({ apiKey: temporaryApiKey }));
  };

  return (
    <>
      <Alert
        open={settings._loaded && !settings.apiKey}
        severity="warning"
        closable
        syncOpen
      >
        In order to use this app you need a Youtube API key!{' '}
        <Link
          href="#"
          color="secondary"
          rel="noopener"
          onClick={handleUseTemporaryKey}
        >
          Use a temporary key.
        </Link>
      </Alert>
      <Alert
        open={settings._loaded && settings.apiKey === temporaryApiKey}
        severity="warning"
        closable
        syncOpen
      >
        You are using a temporary API key, which has a limited quota & might be
        used by other users. It is recommended to create your own key for daily
        use.
      </Alert>
    </>
  );
}

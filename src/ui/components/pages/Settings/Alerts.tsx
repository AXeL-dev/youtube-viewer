import React, { MouseEvent } from 'react';
import { Link } from '@mui/material';
import { Alert } from 'ui/components/shared';
import { useAppDispatch, useAppSelector } from 'store';
import { setSettings } from 'store/reducers/settings';
import { selectApp } from 'store/selectors/app';
import { Settings } from 'types';

const { REACT_APP_YOUTUBE_API_KEY: temporaryApiKey } = process.env;

interface AlertsProps {
  settings: Settings;
}

export default function Alerts(props: AlertsProps) {
  const { settings } = props;
  const app = useAppSelector(selectApp);
  const dispatch = useAppDispatch();

  const handleUseTemporaryKey = (event: MouseEvent) => {
    event.preventDefault();
    dispatch(setSettings({ apiKey: temporaryApiKey }));
  };

  return (
    <>
      <Alert
        open={app.loaded && !settings.apiKey}
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
        open={app.loaded && settings.apiKey === temporaryApiKey}
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

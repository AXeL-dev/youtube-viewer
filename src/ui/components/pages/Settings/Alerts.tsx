import React, { MouseEvent } from 'react';
import { Link } from '@mui/material';
import { Alert } from 'ui/components/shared';
import { useAppDispatch, useAppSelector } from 'store';
import { setSettings } from 'store/reducers/settings';
import { selectApp } from 'store/selectors/app';
import { Settings } from 'types';

const { REACT_APP_YOUTUBE_API_KEY: defaultApiKey } = process.env;

interface AlertsProps {
  settings: Settings;
}

export default function Alerts(props: AlertsProps) {
  const { settings } = props;
  const app = useAppSelector(selectApp);
  const dispatch = useAppDispatch();

  const handleResetApiKey = (event: MouseEvent) => {
    event.preventDefault();
    dispatch(setSettings({ apiKey: defaultApiKey }));
  };

  return (
    <>
      <Alert
        open={app.loaded && !settings.apiKey}
        severity="warning"
        closable
        syncOpen
      >
        In order to use this app you need a Youtube API key!
        {defaultApiKey ? (
          <>
            {' '}
            <Link
              href="#"
              color="secondary"
              rel="noopener"
              onClick={handleResetApiKey}
            >
              Reset API key.
            </Link>
          </>
        ) : null}
      </Alert>
    </>
  );
}

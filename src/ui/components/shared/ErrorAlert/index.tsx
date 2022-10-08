import React, { MouseEvent } from 'react';
import { Alert, AlertProps } from '../Alert';
import { useHistory } from 'react-router-dom';
import { Link } from '@mui/material';

enum Error {
  MISSING_API_KEY = 'The request is missing a valid API key.',
  INVALID_API_KEY = 'API key not valid. Please pass a valid API key.',
}

interface ErrorAlertProps extends AlertProps {
  error?: any;
}

export function ErrorAlert(props: ErrorAlertProps) {
  const { error, ...rest } = props;
  const history = useHistory();

  const handleGoToSettings = (event: MouseEvent) => {
    event.preventDefault();
    history.push('/settings');
  };

  const renderError = () => {
    const errorMessage = error?.data?.error.message || error?.error;
    switch (errorMessage) {
      case Error.MISSING_API_KEY:
      case Error.INVALID_API_KEY:
        return (
          <>
            {errorMessage}{' '}
            <Link
              href="#"
              color="secondary"
              rel="noopener"
              onClick={handleGoToSettings}
            >
              Go to settings.
            </Link>
          </>
        );
      default:
        return errorMessage;
    }
  };

  return <Alert {...rest}>{renderError()}</Alert>;
}

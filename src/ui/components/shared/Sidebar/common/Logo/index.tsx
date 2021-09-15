import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useStyles } from './styles';

const { REACT_APP_NAME, REACT_APP_VERSION } = process.env;

interface LogoProps {
  showVersion?: boolean;
}

export default function Logo(props: LogoProps) {
  const { showVersion } = props;
  const classes = useStyles();

  return (
    <span title={REACT_APP_NAME} className={classes.logo}>
      <img alt="logo" src="icons/128.png" />
      <span className={classes.title}>
        <Typography variant="subtitle1">{REACT_APP_NAME}</Typography>
        {showVersion && (
          <Typography variant="caption" className={classes.version}>
            v{REACT_APP_VERSION}
          </Typography>
        )}
      </span>
    </span>
  );
}

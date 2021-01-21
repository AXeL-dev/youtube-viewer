import React from 'react';
import { Typography, IconButton, Link } from '@material-ui/core';
import { FavoriteRoundedIcon, GitHubIcon } from './icons';
import { useStyles } from './styles';

interface CreditProps {
  author: string;
  repositoryUrl?: string;
}

export function Credit(props: CreditProps) {
  const { author, repositoryUrl } = props;
  const classes = useStyles();

  return (
    <Typography variant="caption" align="center" className={classes.madeWithLove}>
      Made with <FavoriteRoundedIcon className={classes.heartIcon} /> by {author}
      <Link href={repositoryUrl || '#'} target={repositoryUrl ? '_blank' : '_self'} rel="noopener">
        <IconButton edge="end" size="small" aria-label="github link">
          <GitHubIcon fontSize="inherit" />
        </IconButton>
      </Link>
    </Typography>
  );
}

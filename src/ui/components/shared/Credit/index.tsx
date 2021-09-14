import React from 'react';
import { Typography, IconButton, Link } from '@material-ui/core';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import GitHubIcon from '@material-ui/icons/GitHub';
import { useStyles } from './styles';

interface CreditProps {
  author: string;
  repositoryUrl?: string;
}

function Credit(props: CreditProps) {
  const { author, repositoryUrl } = props;
  const classes = useStyles();

  return (
    <Typography variant="caption" align="center">
      Made with <FavoriteRoundedIcon className={classes.heartIcon} /> by {author}
      <Link href={repositoryUrl || '#'} target={repositoryUrl ? '_blank' : '_self'} rel="noopener">
        <IconButton edge="end" size="small" aria-label="github link">
          <GitHubIcon fontSize="inherit" />
        </IconButton>
      </Link>
    </Typography>
  );
}

export default Credit;

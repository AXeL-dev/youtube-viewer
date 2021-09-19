import React from 'react';
import { Typography, IconButton, Link } from '@mui/material';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import GitHubIcon from '@mui/icons-material/GitHub';

interface CreditProps {
  author: string;
  repositoryUrl?: string;
}

export default function Credit(props: CreditProps) {
  const { author, repositoryUrl } = props;

  return (
    <Typography
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5,
      }}
      color="text.secondary"
    >
      Made with <FavoriteRoundedIcon sx={{ color: '#e1495c', fontSize: 18 }} />{' '}
      by {author}
      {repositoryUrl ? (
        <Link href={repositoryUrl} target="_blank" rel="noopener">
          <IconButton sx={{ p: 0 }} size="small" aria-label="github link">
            <GitHubIcon fontSize="inherit" />
          </IconButton>
        </Link>
      ) : null}
    </Typography>
  );
}

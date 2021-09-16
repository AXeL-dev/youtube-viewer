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
    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
      Made with <FavoriteRoundedIcon sx={{ color: '#e1495c', fontSize: 16 }} /> by {author}
      <Link href={repositoryUrl || '#'} target={repositoryUrl ? '_blank' : '_self'} rel="noopener">
        <IconButton size="small" aria-label="github link" sx={{ p: 0 }}>
          <GitHubIcon fontSize="inherit" />
        </IconButton>
      </Link>
    </Typography>
  );
}

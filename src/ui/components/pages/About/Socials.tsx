import React from 'react';
import { Box, Link } from '@mui/material';
import { SxProps } from '@mui/system/styleFunctionSx';
import { Theme } from '@mui/material/styles';
import GitHubIcon from '@mui/icons-material/GitHub';
import MailIcon from '@mui/icons-material/Mail';
import ForumIcon from '@mui/icons-material/Forum';
import { useAppSelector } from 'store';
import { selectMode } from 'store/selectors/settings';

interface SocialsProps {
  sx?: SxProps<Theme>;
}

export default function Socials(props: SocialsProps) {
  const { sx = {} } = props;
  const mode = useAppSelector(selectMode);

  return (
    <Box sx={{ display: 'flex', gap: 1.5, color: mode === 'light' ? 'grey.800' : 'grey.100', ...sx }}>
      <Link title="Gmail" href="mailto:contact.axel.dev@gmail.com" target="_blank" color="inherit" rel="noopener">
        <MailIcon />
      </Link>
      <Link title="Discord" href="https://discord.gg/rpD4fgxBgj" target="_blank" color="inherit" rel="noopener">
        <ForumIcon />
      </Link>
      <Link
        title="Github"
        href="https://github.com/AXeL-dev/youtube-viewer"
        target="_blank"
        color="inherit"
        rel="noopener"
      >
        <GitHubIcon />
      </Link>
    </Box>
  );
}

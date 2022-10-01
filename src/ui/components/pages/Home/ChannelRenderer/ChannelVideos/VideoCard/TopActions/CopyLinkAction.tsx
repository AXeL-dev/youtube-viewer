import React, { useState } from 'react';
import { Grow, IconButton, Tooltip } from '@mui/material';
import { ExtraVideoAction, Video } from 'types';
import LinkIcon from '@mui/icons-material/Link';
import CheckIcon from '@mui/icons-material/Check';
import copy from 'copy-to-clipboard';
import { useAppSelector } from 'store';
import { selectHasExtraVideoAction } from 'store/selectors/settings';

interface CopyLinkActionProps {
  video: Video;
}

function CopyLinkAction(props: CopyLinkActionProps) {
  const { video } = props;
  const [isShown, setIsShown] = useState(true);
  const [copied, setCopied] = useState(false);
  const enabled = useAppSelector(
    selectHasExtraVideoAction(ExtraVideoAction.CopyLink),
  );

  const handleClick = () => {
    if (copied) return;
    copy(video.url);
    setCopied(true);
    setTimeout(() => {
      setIsShown(false);
    }, 1000);
  };

  return enabled ? (
    <Grow in={isShown}>
      <Tooltip
        title={copied ? 'Copied!' : 'Copy link to clipboard'}
        aria-label="copy-link"
      >
        <IconButton
          sx={{
            color: '#eee',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: '4px',
            borderRadius: '2px',
            '&:hover': {
              color: '#fff',
            },
          }}
          size="small"
          onClick={handleClick}
        >
          {copied ? (
            <CheckIcon sx={{ fontSize: '1.125rem' }} color="success" />
          ) : (
            <LinkIcon sx={{ fontSize: '1.125rem' }} />
          )}
        </IconButton>
      </Tooltip>
    </Grow>
  ) : null;
}

export default CopyLinkAction;

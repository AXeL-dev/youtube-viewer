import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import { HomeView, Video } from 'types';
import { useAppDispatch, useAppSelector } from 'store';
import { archiveVideo, unarchiveVideo } from 'store/reducers/videos';
import { selectVideoMeta } from 'store/selectors/videos';

interface ArchiveActionProps {
  video: Video;
  view: HomeView;
}

function ArchiveAction(props: ArchiveActionProps) {
  const { video, view } = props;
  const { isArchived } = useAppSelector(selectVideoMeta(video));
  const dispatch = useAppDispatch();

  return view === HomeView.WatchLater ? (
    isArchived ? (
      <Tooltip title="Unarchive" aria-label="unarchive">
        <IconButton
          sx={{
            display: 'flex',
            color: '#eee',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: '4px',
            borderRadius: '2px',
            '&:hover': {
              color: '#fff',
            },
          }}
          size="small"
          onClick={() => {
            dispatch(unarchiveVideo(video));
          }}
        >
          <UnarchiveIcon sx={{ fontSize: '1.125rem' }} />
        </IconButton>
      </Tooltip>
    ) : (
      <Tooltip title="Archive" aria-label="archive">
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
          onClick={() => {
            dispatch(archiveVideo(video));
          }}
        >
          <ArchiveIcon sx={{ fontSize: '1.125rem' }} />
        </IconButton>
      </Tooltip>
    )
  ) : null;
}

export default ArchiveAction;

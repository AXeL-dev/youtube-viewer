import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CloseIcon from '@mui/icons-material/Close';
import { HomeView, Video } from 'types';
import { useAppDispatch, useAppSelector } from 'store';
import { addVideoFlag, removeVideoFlag } from 'store/reducers/videos';
import { selectVideoFlag } from 'store/selectors/videos';
import { selectHasHiddenView } from 'store/selectors/settings';

interface BookmarkActionProps {
  video: Video;
  view: HomeView;
}

const flag = 'bookmarked';

function BookmarkAction(props: BookmarkActionProps) {
  const { video, view } = props;
  const isBookmarked = useAppSelector(selectVideoFlag(video, flag));
  const isBookmarksViewHidden = useAppSelector(
    selectHasHiddenView(HomeView.Bookmarks),
  );
  const dispatch = useAppDispatch();

  if (isBookmarksViewHidden) {
    return null;
  }

  return !isBookmarked ? (
    <Tooltip title="Bookmark" aria-label="bookmark">
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
          dispatch(
            addVideoFlag({
              video,
              flag,
            }),
          );
        }}
      >
        <BookmarkIcon sx={{ fontSize: '1.125rem' }} />
      </IconButton>
    </Tooltip>
  ) : view === HomeView.Bookmarks ? (
    <Tooltip title="Remove" aria-label="remove-from-bookmarks">
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
          dispatch(
            removeVideoFlag({
              video,
              flag,
            }),
          );
        }}
      >
        <CloseIcon sx={{ fontSize: '1.125rem' }} />
      </IconButton>
    </Tooltip>
  ) : null;
}

export default BookmarkAction;

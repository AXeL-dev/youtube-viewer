import React from 'react';
import { Box } from '@mui/material';
import { useAppSelector } from 'store';
import { selectBookmarkedVideosCount } from 'store/selectors/videos';
import BookmarksViewOptions from './BookmarksViewOptions';

interface BookmarksViewActionsProps {}

function BookmarksViewActions(props: BookmarksViewActionsProps) {
  const bookmarkedVideosCount = useAppSelector(selectBookmarkedVideosCount);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <BookmarksViewOptions videosCount={bookmarkedVideosCount} />
    </Box>
  );
}

export default BookmarksViewActions;

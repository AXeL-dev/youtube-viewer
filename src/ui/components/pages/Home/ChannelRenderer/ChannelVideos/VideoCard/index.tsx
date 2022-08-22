import React, { MouseEvent } from 'react';
import { Box, IconButton, Tooltip, Typography, Link } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { HomeView, Video } from 'types';
import { useAppDispatch } from 'store';
import { addViewedVideo } from 'store/reducers/videos';
import TopActions from './TopActions';
import Badges from './Badges';
import { createTab, isWebExtension } from 'helpers/webext';

interface VideoCardProps {
  video: Video;
  view: HomeView;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  onVideoPlay: (video: Video) => void;
}

function VideoCard(props: VideoCardProps) {
  const {
    video,
    view,
    thumbnailWidth = '100%',
    thumbnailHeight = 120,
    onVideoPlay,
  } = props;
  const dispatch = useAppDispatch();

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          '&:hover .overlay': {
            opacity: 1,
          },
          '&:hover .options': {
            opacity: 1,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: thumbnailWidth,
            height: thumbnailHeight,
            backgroundImage: `url("${video.thumbnail}")`,
            //backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        />
        <Box
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            position: 'absolute',
            height: '100%',
            width: '100%',
            left: 0,
            top: 0,
            bottom: 0,
            right: 0,
            opacity: 0,
            transition: 'opacity 0.4s ease-in-out 0s',
          }}
          className="overlay"
        ></Box>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: 0,
            width: '100%',
            height: '100%',
            transition: 'opacity 0.3s ease-in-out 0s',
          }}
          className="options"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              textAlign: 'center',
              paddingLeft: '1rem',
              paddingRight: '1rem',
            }}
          >
            <Link
              sx={{ textDecoration: 'none', outline: 'none' }}
              href={video.url}
              target="_blank"
              rel="noopener"
              onClick={(event: MouseEvent) => {
                if (isWebExtension) {
                  event.preventDefault();
                  createTab(video.url, false);
                }
                dispatch(addViewedVideo(video));
              }}
            >
              <IconButton sx={{ color: '#fff', margin: 0.5 }} size="small">
                <Tooltip title="Open in Youtube" aria-label="watch-later">
                  <OpenInNewIcon sx={{ fontSize: '1.5rem' }} />
                </Tooltip>
              </IconButton>
            </Link>
            <IconButton
              sx={{ color: '#fff', margin: 0.5 }}
              size="small"
              onClick={() => {
                onVideoPlay(video);
                dispatch(addViewedVideo(video));
              }}
            >
              <Tooltip title="Watch" aria-label="watch">
                <PlayArrowIcon sx={{ fontSize: '2.1rem' }} />
              </Tooltip>
            </IconButton>
          </Box>
          <TopActions video={video} view={view} />
        </Box>
        <Badges video={video} view={view} />
        <Typography
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            margin: '4px',
            color: '#fff',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: '2px 4px',
            borderRadius: '2px',
          }}
          variant="caption"
        >
          {video.duration}
        </Typography>
      </Box>
      <Box pr={2} mt={1}>
        <Tooltip
          title={video.title}
          enterDelay={700}
          enterNextDelay={700}
          aria-label="video-title"
        >
          <Typography
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              marginBottom: '0.5rem',
              minHeight: '2.5rem',
            }}
            variant="body2"
          >
            {video.title}
          </Typography>
        </Tooltip>
        <Typography display="block" variant="caption" color="textSecondary">
          {video.channelTitle}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {`${video.views} • ${video.publishedSince}`}
        </Typography>
      </Box>
    </>
  );
}

function propsAreEqual(prevProps: VideoCardProps, nextProps: VideoCardProps) {
  return (
    prevProps.view === nextProps.view &&
    prevProps.thumbnailHeight === nextProps.thumbnailHeight &&
    prevProps.thumbnailWidth === nextProps.thumbnailWidth &&
    prevProps.video.id === nextProps.video.id
  );
}

export default React.memo(VideoCard, propsAreEqual);

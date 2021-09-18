import React from 'react';
import List from '@mui/material/List';
import ExploreIcon from '@mui/icons-material/Explore';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ListItemLink from './ListItemLink';
import Header from './Header';
import { Box, Typography, Link } from '@mui/material';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import { useAppSelector } from 'store';
import { selectChannelsCount } from 'store/selectors/channels';

interface SidebarProps {}

export function Sidebar(props: SidebarProps) {
  const channelsCount = useAppSelector(selectChannelsCount);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: 280,
        maxWidth: 280,
        backgroundColor: 'custom.lightGrey',
        borderRight: 1,
        borderColor: 'divider',
      }}
    >
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', py: 2.5, pl: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
          <Header showVersion />
        </Box>
        <Box sx={{ flexGrow: 1, paddingLeft: 1, width: '100%' }}>
          <List component="nav" aria-label="main">
            <ListItemLink icon={<ExploreIcon />} text="Home" to="/" />
            <ListItemLink icon={<SubscriptionsIcon />} text="Channels" to="/channels" badge={channelsCount} />
            <ListItemLink icon={<SettingsIcon />} text="Settings" to="/settings" />
            <ListItemLink icon={<InfoOutlinedIcon />} text="About" to="/about" />
          </List>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          py: 2,
          px: 3,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Typography sx={{ fontSize: '0.8rem', mb: 1 }} variant="caption" color="text.secondary">
          Facing issues or have some feedback?
        </Typography>
        <Link
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            fontSize: '0.8rem',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
          href="https://github.com/AXeL-dev/youtube-viewer/issues"
          target="_blank"
          color="secondary"
          rel="noopener"
        >
          <ContactSupportIcon sx={{ fontSize: 18 }} />
          Report a bug | Feedback
        </Link>
      </Box>
    </Box>
  );
}

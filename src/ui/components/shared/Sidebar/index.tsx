import React from 'react';
import List from '@mui/material/List';
import ExploreIcon from '@mui/icons-material/Explore';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ListItemLink from './ListItemLink';
import Credit from './Credit';
import Logo from './Logo';
import { Box } from '@mui/material';

interface SidebarProps {}

export function Sidebar(props: SidebarProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: 280,
        backgroundColor: '#fafafa',
        borderRight: '1px solid #e8e8e8',
      }}
    >
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', py: 2.5, pl: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
          <Logo showVersion />
        </Box>
        <Box sx={{ flexGrow: 1, paddingLeft: 1, width: '100%' }}>
          <List component="nav" aria-label="main">
            <ListItemLink icon={<ExploreIcon />} text="Home" to="/" />
            <ListItemLink icon={<SubscriptionsIcon />} text="Channels" to="/channels" badge={2} />
            <ListItemLink icon={<SettingsIcon />} text="Settings" to="/settings" />
            <ListItemLink icon={<InfoOutlinedIcon />} text="About" to="/about" />
          </List>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 2,
          px: 3,
          borderTop: '1px solid #e8e8e8',
        }}
      >
        <Credit author="AXeL" repositoryUrl="https://github.com/AXeL-dev/youtube-viewer" />
      </Box>
    </Box>
  );
}

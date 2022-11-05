import React from 'react';
import { Tooltip } from '@mui/material';
import { useChannelOptions } from 'providers';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface ChannelExpandToggleProps {}

function ChannelExpandToggle(props: ChannelExpandToggleProps) {
  const { collapseByDefault, collapsed, setCollapsed } = useChannelOptions();

  const handleToggle = () => {
    setCollapsed(!collapsed);
  };

  if (!collapseByDefault) {
    return null;
  }

  return collapsed ? (
    <Tooltip title="Expand">
      <ExpandMoreIcon sx={{ cursor: 'pointer' }} onClick={handleToggle} />
    </Tooltip>
  ) : (
    <Tooltip title="Collapse">
      <ExpandLessIcon sx={{ cursor: 'pointer' }} onClick={handleToggle} />
    </Tooltip>
  );
}

export default ChannelExpandToggle;

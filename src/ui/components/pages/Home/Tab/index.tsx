import React from 'react';
import { Box } from '@mui/material';
import MuiTab, { TabProps as MuiTabProps } from '@mui/material/Tab';
import Badge from './Badge';
import { HomeView } from 'types';
import { useChannelVideos } from 'providers';

interface TabProps extends MuiTabProps {
  value: HomeView;
  selected?: boolean;
}

export default function Tab(props: TabProps) {
  const { label, value: view, selected, ...rest } = props;
  const { getAllVideosCount } = useChannelVideos(view);
  const badgeContent = getAllVideosCount();

  return (
    <MuiTab
      sx={{
        fontSize: '0.975rem',
        fontWeight: 400,
        minWidth: 140,
        textTransform: 'capitalize',
      }}
      label={
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {label}
          {selected && badgeContent ? (
            <Badge
              badgeContent={badgeContent}
              title={`${badgeContent || ''}`}
            />
          ) : null}
        </Box>
      }
      value={view}
      disableRipple
      {...rest}
    />
  );
}

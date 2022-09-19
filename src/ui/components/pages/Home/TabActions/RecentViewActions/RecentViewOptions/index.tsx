import React, { useRef, useState } from 'react';
import {
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { StyledMenu } from 'ui/components/shared';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SortIcon from '@mui/icons-material/Sort';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import HistoryIcon from '@mui/icons-material/History';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { HomeView, Nullable } from 'types';
import { NestedMenuRef } from 'ui/components/shared/StyledMenu/NestedMenu';
import RecentVideosSeniority from './RecentVideosSeniority';
import RecentViewMoreActions from './RecentViewMoreActions';
import ViewSorting from '../../common/ViewSorting';
import ViewFilters, { FilterOption } from '../../common/ViewFilters';

const options: FilterOption[] = [
  {
    label: 'Seen',
    value: 'seen',
  },
  {
    label: 'Watch later',
    value: 'watchLater',
  },
  {
    label: 'Ignored',
    value: 'ignored',
  },
  {
    label: 'Others',
    value: 'others',
  },
];

interface RecentViewOptionsProps {}

function RecentViewOptions(props: RecentViewOptionsProps) {
  const [anchorEl, setAnchorEl] = useState<Nullable<HTMLElement>>(null);
  const open = Boolean(anchorEl);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const menusRef = useRef<{ [key: string]: NestedMenuRef | null }>({
    sorting: null,
    filters: null,
    videosSeniority: null,
    moreActions: null,
  });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        id="more-button"
        aria-label="more"
        aria-controls={open ? 'more-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <StyledMenu
        id="more-menu"
        MenuListProps={{
          'aria-labelledby': 'more-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={menusRef.current['sorting']?.open}>
          <ListItemIcon>
            <SortIcon />
          </ListItemIcon>
          <ListItemText>Sort by</ListItemText>
        </MenuItem>
        <MenuItem onClick={menusRef.current['filters']?.open}>
          <ListItemIcon>
            <FilterAltIcon />
          </ListItemIcon>
          <ListItemText>Filters ({activeFiltersCount})</ListItemText>
        </MenuItem>
        <MenuItem onClick={menusRef.current['videosSeniority']?.open}>
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText>Videos seniority</ListItemText>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={menusRef.current['moreActions']?.open}>
          <ListItemIcon>
            <MoreHorizIcon />
          </ListItemIcon>
          <ListItemText>More</ListItemText>
        </MenuItem>
      </StyledMenu>
      <ViewSorting
        ref={(ref) => (menusRef.current['sorting'] = ref)}
        view={HomeView.Recent}
      />
      <ViewFilters
        ref={(ref) => (menusRef.current['filters'] = ref)}
        view={HomeView.Recent}
        options={options}
        onActiveFiltersCountChange={setActiveFiltersCount}
      />
      <RecentVideosSeniority
        ref={(ref) => (menusRef.current['videosSeniority'] = ref)}
      />
      <RecentViewMoreActions
        ref={(ref) => (menusRef.current['moreActions'] = ref)}
      />
    </>
  );
}

export default RecentViewOptions;

import React, { useState } from 'react';
import { IconButton, ListSubheader } from '@mui/material';
import { StyledMenu, CheckableMenuItem } from 'ui/components/shared';
import { useAppDispatch, useAppSelector } from 'store';
import SortIcon from '@mui/icons-material/Sort';
import { selectViewSorting } from 'store/selectors/settings';
import { setViewSorting } from 'store/reducers/settings';
import { HomeView, Nullable, ViewSorting } from 'types';

const options: {
  label: string;
  value: keyof ViewSorting;
}[] = [
  {
    label: 'Publish date',
    value: 'publishDate',
  },
];

interface AllViewSortingProps {}

function AllViewSorting(props: AllViewSortingProps) {
  const sorting = useAppSelector(selectViewSorting(HomeView.All));
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<Nullable<HTMLElement>>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSortToggle = (key: keyof ViewSorting) => {
    dispatch(
      setViewSorting({
        view: HomeView.All,
        sorting: {
          [key]: !sorting[key],
        },
      }),
    );
  };

  return (
    <>
      <IconButton
        id="sort-button"
        aria-label="sort"
        aria-controls={open ? 'sort-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <SortIcon />
      </IconButton>
      <StyledMenu
        id="sort-menu"
        MenuListProps={{
          'aria-labelledby': 'sort-button',
          dense: true,
          subheader: <ListSubheader component="div">Sort by</ListSubheader>,
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {options.map(({ label, value }, index) => (
          <CheckableMenuItem
            key={index}
            checked={!!sorting[value]}
            onClick={() => handleSortToggle(value)}
          >
            {label}
          </CheckableMenuItem>
        ))}
      </StyledMenu>
    </>
  );
}

export default AllViewSorting;

import React, { useMemo } from 'react';
import { ListItemIcon, ListItemText } from '@mui/material';
import {
  CheckableMenuItem,
  NestedMenuItem,
  NestedMenuItemProps,
} from 'ui/components/shared';
import { useAppDispatch, useAppSelector } from 'store';
import {
  selectViewFilters,
  getActiveViewFilters,
} from 'store/selectors/settings';
import { setViewFilters } from 'store/reducers/settings';
import { HomeView, ViewFilters as Filters } from 'types';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

export interface ViewFilterOption {
  label: string;
  value: keyof Filters;
}

interface ViewFiltersProps extends Omit<NestedMenuItemProps, 'label'> {
  view: HomeView;
  options: ViewFilterOption[];
}

function ViewFilters(props: ViewFiltersProps) {
  const { view, options, ...rest } = props;
  const filters = useAppSelector(selectViewFilters(view));
  const dispatch = useAppDispatch();
  const activeFiltersCount = useMemo(
    () => getActiveViewFilters(filters).length,
    [filters],
  );

  const handleFilterToggle = (key: keyof Filters) => {
    dispatch(
      setViewFilters({
        view,
        filters: {
          [key]: !filters[key],
        },
      }),
    );
  };

  return (
    <NestedMenuItem
      label={
        <>
          <ListItemIcon>
            <FilterAltIcon />
          </ListItemIcon>
          <ListItemText>Filters ({activeFiltersCount})</ListItemText>
        </>
      }
      {...rest}
    >
      {options.map(({ label, value }, index) => (
        <CheckableMenuItem
          key={index}
          checked={!!filters[value]}
          onClick={() => handleFilterToggle(value)}
        >
          {label}
        </CheckableMenuItem>
      ))}
    </NestedMenuItem>
  );
}

export default ViewFilters;

import React from 'react';
import { ListItemIcon, ListItemText } from '@mui/material';
import {
  CheckableMenuItem,
  NestedMenuItem,
  NestedMenuItemProps,
} from 'ui/components/shared';
import { useAppDispatch, useAppSelector } from 'store';
import { selectViewSorting } from 'store/selectors/settings';
import { setViewSorting } from 'store/reducers/settings';
import { HomeView, ViewSorting as Sorting } from 'types';
import SortIcon from '@mui/icons-material/Sort';

interface ViewSortingOption {
  label: string;
  value: keyof Sorting;
}

const options: ViewSortingOption[] = [
  {
    label: 'Publish date',
    value: 'publishDate',
  },
];

interface ViewSortingProps extends Omit<NestedMenuItemProps, 'label'> {
  view: HomeView;
}

function ViewSorting(props: ViewSortingProps) {
  const { view, ...rest } = props;
  const sorting = useAppSelector(selectViewSorting(view));
  const dispatch = useAppDispatch();

  const handleSortToggle = (key: keyof Sorting) => {
    dispatch(
      setViewSorting({
        view,
        sorting: {
          [key]: !sorting[key],
        },
      }),
    );
  };

  return (
    <NestedMenuItem
      label={
        <>
          <ListItemIcon>
            <SortIcon />
          </ListItemIcon>
          <ListItemText>Sort by</ListItemText>
        </>
      }
      isFirstItem
      {...rest}
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
    </NestedMenuItem>
  );
}

export default ViewSorting;

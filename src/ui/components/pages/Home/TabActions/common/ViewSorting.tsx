import React from 'react';
import { CheckableMenuItem } from 'ui/components/shared';
import { useAppDispatch, useAppSelector } from 'store';
import { selectViewSorting } from 'store/selectors/settings';
import { setViewSorting } from 'store/reducers/settings';
import { HomeView, ViewSorting as Sorting } from 'types';
import NestedMenu, {
  NestedMenuRef,
} from 'ui/components/shared/StyledMenu/NestedMenu';

const options: {
  label: string;
  value: keyof Sorting;
}[] = [
  {
    label: 'Publish date',
    value: 'publishDate',
  },
];

interface ViewSortingProps {
  view: HomeView;
}

const ViewSorting = React.forwardRef<NestedMenuRef, ViewSortingProps>(
  (props, ref) => {
    const { view } = props;
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
      <NestedMenu
        id="sort-menu"
        ref={ref}
        style={{
          marginTop: -1,
        }}
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
      </NestedMenu>
    );
  },
);

export default ViewSorting;

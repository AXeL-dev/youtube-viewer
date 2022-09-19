import React, { useEffect } from 'react';
import { CheckableMenuItem } from 'ui/components/shared';
import { useAppDispatch, useAppSelector } from 'store';
import { selectViewFilters } from 'store/selectors/settings';
import { setViewFilters } from 'store/reducers/settings';
import { HomeView, ViewFilters as Filters } from 'types';
import NestedMenu, {
  NestedMenuRef,
} from 'ui/components/shared/StyledMenu/NestedMenu';

export interface FilterOption {
  label: string;
  value: keyof Filters;
}

interface ViewFiltersProps {
  view: HomeView;
  options: FilterOption[];
  onActiveFiltersCountChange?: (count: number) => void;
}

const ViewFilters = React.forwardRef<NestedMenuRef, ViewFiltersProps>(
  (props, ref) => {
    const { view, options, onActiveFiltersCountChange } = props;
    const filters = useAppSelector(selectViewFilters(view));
    const dispatch = useAppDispatch();

    useEffect(() => {
      if (onActiveFiltersCountChange) {
        const count = options.filter(({ value }) => filters[value]).length;
        onActiveFiltersCountChange(count);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

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
      <NestedMenu id="filter-menu" ref={ref}>
        {options.map(({ label, value }, index) => (
          <CheckableMenuItem
            key={index}
            checked={!!filters[value]}
            onClick={() => handleFilterToggle(value)}
          >
            {label}
          </CheckableMenuItem>
        ))}
      </NestedMenu>
    );
  },
);

export default ViewFilters;

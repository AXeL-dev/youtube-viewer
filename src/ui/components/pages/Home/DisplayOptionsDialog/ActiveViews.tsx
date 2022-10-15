import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Switch,
} from '@mui/material';
import { useAppSelector } from 'store';
import { selectHiddenViews } from 'store/selectors/settings';
import { HomeView } from 'types';

interface ActiveViewsProps {}

interface View {
  label: string;
  value: HomeView;
  hidden: boolean;
}

export interface ActiveViewsRef {
  reset: () => void;
  getViews: () => View[];
  setViews: (views: View[]) => void;
}

const ActiveViews = forwardRef<ActiveViewsRef, ActiveViewsProps>(
  (props, ref) => {
    const hiddenViews = useAppSelector(selectHiddenViews);
    const initialViews: View[] = [
      {
        label: 'All',
        value: HomeView.All,
        hidden: hiddenViews.includes(HomeView.All),
      },
      {
        label: 'Watch Later',
        value: HomeView.WatchLater,
        hidden: hiddenViews.includes(HomeView.WatchLater),
      },
      {
        label: 'Bookmarks',
        value: HomeView.Bookmarks,
        hidden: hiddenViews.includes(HomeView.Bookmarks),
      },
    ];
    const [views, setViews] = useState(initialViews);

    useImperativeHandle(
      ref,
      () => ({
        reset: () => setViews(initialViews),
        getViews: () => views,
        setViews,
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [views],
    );

    const handleToggle = (target: View) => {
      setViews((state) =>
        state.map((view) =>
          view.value === target.value
            ? {
                ...view,
                hidden: !view.hidden,
              }
            : view,
        ),
      );
    };

    return (
      <FormControl
        component="fieldset"
        variant="standard"
        focused={false}
        fullWidth
      >
        <FormLabel component="legend">Active views</FormLabel>
        <FormGroup>
          {views.map((view) => (
            <FormControlLabel
              onClick={() => handleToggle(view)}
              key={view.value}
              control={
                <Switch
                  color="secondary"
                  checked={!view.hidden}
                  name={view.value}
                />
              }
              label={view.label}
            />
          ))}
        </FormGroup>
      </FormControl>
    );
  },
);

export default ActiveViews;

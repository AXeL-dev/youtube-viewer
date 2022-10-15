import React from 'react';
import { ListItemIcon, ListItemText } from '@mui/material';
import {
  CheckableMenuItem,
  NestedMenuItem,
  NestedMenuItemProps,
} from 'ui/components/shared';
import { useAppDispatch, useAppSelector } from 'store';
import { selectVideosSeniority } from 'store/selectors/settings';
import { setVideosSeniority } from 'store/reducers/settings';
import { HomeView, VideosSeniority } from 'types';
import HistoryIcon from '@mui/icons-material/History';

const options = [
  {
    label: '1 day',
    value: VideosSeniority.OneDay,
  },
  {
    label: '3 days',
    value: VideosSeniority.ThreeDays,
  },
  {
    label: '7 days',
    value: VideosSeniority.SevenDays,
  },
  {
    label: '2 weeks',
    value: VideosSeniority.TwoWeeks,
  },
  {
    label: '1 month',
    value: VideosSeniority.OneMonth,
  },
  {
    label: 'any',
    value: VideosSeniority.Any,
  },
];

interface ViewVideosSeniorityProps extends Omit<NestedMenuItemProps, 'label'> {
  view: HomeView;
}

function ViewVideosSeniority(props: ViewVideosSeniorityProps) {
  const { view, ...rest } = props;
  const seniority = useAppSelector(selectVideosSeniority(view));
  const dispatch = useAppDispatch();

  const handleChange = (seniority: VideosSeniority) => {
    dispatch(setVideosSeniority({ view, seniority }));
  };

  return (
    <NestedMenuItem
      label={
        <>
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText>Videos seniority</ListItemText>
        </>
      }
      MenuProps={{
        style: {
          minWidth: 160,
        },
      }}
      {...rest}
    >
      {options.map(({ label, value }, index) => (
        <CheckableMenuItem
          key={index}
          checked={seniority === value}
          onClick={() => handleChange(value)}
        >
          {label}
        </CheckableMenuItem>
      ))}
    </NestedMenuItem>
  );
}

export default ViewVideosSeniority;

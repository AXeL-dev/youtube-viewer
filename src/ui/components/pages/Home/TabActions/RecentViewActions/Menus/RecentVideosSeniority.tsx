import React from 'react';
import { ListItemIcon, ListItemText } from '@mui/material';
import {
  CheckableMenuItem,
  NestedMenuItem,
  NestedMenuItemProps,
} from 'ui/components/shared';
import { useAppDispatch, useAppSelector } from 'store';
import { selectRecentVideosSeniority } from 'store/selectors/settings';
import { setSettings } from 'store/reducers/settings';
import { VideosSeniority } from 'types';
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
];

interface RecentVideosSeniorityProps
  extends Omit<NestedMenuItemProps, 'label'> {}

function RecentVideosSeniority(props: RecentVideosSeniorityProps) {
  const seniority = useAppSelector(selectRecentVideosSeniority);
  const dispatch = useAppDispatch();

  const handleChange = (recentVideosSeniority: VideosSeniority) => {
    dispatch(setSettings({ recentVideosSeniority }));
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
      {...props}
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

export default RecentVideosSeniority;

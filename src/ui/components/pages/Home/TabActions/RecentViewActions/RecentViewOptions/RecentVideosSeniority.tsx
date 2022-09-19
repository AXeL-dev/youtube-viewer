import React from 'react';
import { CheckableMenuItem } from 'ui/components/shared';
import { useAppDispatch, useAppSelector } from 'store';
import { selectRecentVideosSeniority } from 'store/selectors/settings';
import { setSettings } from 'store/reducers/settings';
import { VideosSeniority } from 'types';
import NestedMenu, {
  NestedMenuRef,
} from 'ui/components/shared/StyledMenu/NestedMenu';

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

interface RecentVideosSeniorityProps {}

const RecentVideosSeniority = React.forwardRef<
  NestedMenuRef,
  RecentVideosSeniorityProps
>((props, ref) => {
  const seniority = useAppSelector(selectRecentVideosSeniority);
  const dispatch = useAppDispatch();

  const handleChange = (recentVideosSeniority: VideosSeniority) => {
    dispatch(setSettings({ recentVideosSeniority }));
  };

  return (
    <NestedMenu
      id="seniority-menu"
      ref={ref}
      style={{
        minWidth: 160,
      }}
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
    </NestedMenu>
  );
});

export default RecentVideosSeniority;

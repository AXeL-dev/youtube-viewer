import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import { StyledMenu, CheckableMenuItem } from 'ui/components/shared';
import { useAppDispatch, useAppSelector } from 'store';
import HistoryIcon from '@mui/icons-material/History';
import { selectRecentVideosSeniority } from 'store/selectors/settings';
import { setSettings } from 'store/reducers/settings';
import { Nullable, VideosSeniority } from 'types';

interface RecentVideosSeniorityProps {}

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

function RecentVideosSeniority(props: RecentVideosSeniorityProps) {
  const seniority = useAppSelector(selectRecentVideosSeniority);
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<Nullable<HTMLElement>>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (recentVideosSeniority: VideosSeniority) => {
    dispatch(setSettings({ recentVideosSeniority }));
  };

  return (
    <>
      <IconButton
        id="seniority-button"
        aria-label="seniority"
        aria-controls={open ? 'seniority-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <HistoryIcon />
      </IconButton>
      <StyledMenu
        id="seniority-menu"
        style={{
          minWidth: 160,
        }}
        MenuListProps={{
          'aria-labelledby': 'seniority-button',
          dense: true,
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
            checked={seniority === value}
            onClick={() => handleChange(value)}
          >
            {label}
          </CheckableMenuItem>
        ))}
      </StyledMenu>
    </>
  );
}

export default RecentVideosSeniority;

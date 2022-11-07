import React from 'react';
import { ListItemIcon, ListItemText } from '@mui/material';
import {
  CheckableMenuItem,
  NestedMenuItem,
  NestedMenuItemProps,
} from 'ui/components/shared';
import { useAppDispatch, useAppSelector } from 'store';
import { selectViewChannelOptions } from 'store/selectors/settings';
import { setViewChannelOptions } from 'store/reducers/settings';
import { ChannelOptions, HomeView } from 'types';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';

export interface ViewChannelOption {
  label: string;
  value: keyof ChannelOptions;
}

const options: ViewChannelOption[] = [
  {
    label: 'Collapse channels by default',
    value: 'collapseByDefault',
  },
  {
    label: 'Display videos count per channel',
    value: 'displayVideosCount',
  },
  {
    label: 'Open channel on name click',
    value: 'openChannelOnNameClick',
  },
];

interface ViewChannelOptionsProps extends Omit<NestedMenuItemProps, 'label'> {
  view: HomeView;
}

function ViewChannelOptions(props: ViewChannelOptionsProps) {
  const { view, ...rest } = props;
  const channelOptions = useAppSelector(selectViewChannelOptions(view));
  const dispatch = useAppDispatch();

  const handleOptionToggle = (key: keyof ChannelOptions) => {
    dispatch(
      setViewChannelOptions({
        view,
        options: {
          [key]: !channelOptions[key],
        },
      }),
    );
  };

  return (
    <NestedMenuItem
      label={
        <>
          <ListItemIcon>
            <SubscriptionsIcon />
          </ListItemIcon>
          <ListItemText>Channels</ListItemText>
        </>
      }
      {...rest}
    >
      {options.map(({ label, value }, index) => (
        <CheckableMenuItem
          key={index}
          checked={!!channelOptions[value]}
          onClick={() => handleOptionToggle(value)}
        >
          {label}
        </CheckableMenuItem>
      ))}
    </NestedMenuItem>
  );
}

export default ViewChannelOptions;

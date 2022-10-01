import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Switch,
} from '@mui/material';
import { useAppSelector } from 'store';
import { selectExtraVideoActions } from 'store/selectors/settings';
import { ExtraVideoAction } from 'types';

interface ExtraVideoActionsProps {}

interface Action {
  label: string;
  value: ExtraVideoAction;
  active: boolean;
}

export interface ExtraVideoActionsRef {
  reset: () => void;
  getActions: () => Action[];
  setActions: (actions: Action[]) => void;
}

const ExtraVideoActions = forwardRef<
  ExtraVideoActionsRef,
  ExtraVideoActionsProps
>((props, ref) => {
  const extraVideoActions = useAppSelector(selectExtraVideoActions);
  const initialActions: Action[] = [
    {
      label: 'Copy link to clipboard',
      value: ExtraVideoAction.CopyLink,
      active: extraVideoActions.includes(ExtraVideoAction.CopyLink),
    },
  ];
  const [actions, setActions] = useState(initialActions);

  useImperativeHandle(
    ref,
    () => ({
      reset: () => setActions(initialActions),
      getActions: () => actions,
      setActions,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [actions],
  );

  const handleToggle = (target: Action) => {
    setActions((state) =>
      state.map((action) =>
        action.value === target.value
          ? {
              ...action,
              active: !action.active,
            }
          : action,
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
      <FormLabel component="legend">Extra video actions</FormLabel>
      <FormGroup>
        {actions.map((action) => (
          <FormControlLabel
            onClick={() => handleToggle(action)}
            key={action.value}
            control={
              <Switch
                color="secondary"
                checked={action.active}
                name={action.value}
              />
            }
            label={action.label}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
});

export default ExtraVideoActions;

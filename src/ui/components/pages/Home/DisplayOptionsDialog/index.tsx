import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { HomeView } from 'types';
import { useDidMountEffect } from 'hooks/useDidMountEffect';
import { useAppDispatch, useAppSelector } from 'store';
import { selectHomeDisplayOptions } from 'store/selectors/settings';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import { setHomeDisplayOptions } from 'store/reducers/settings';

interface DisplayOptionsDialogProps {
  open: boolean;
  onClose: () => void;
}

interface View {
  label: string;
  value: HomeView;
  hidden: boolean;
}

export default function DisplayOptionsDialog(props: DisplayOptionsDialogProps) {
  const { open, onClose } = props;
  const displayOptions = useAppSelector(selectHomeDisplayOptions);
  const dispatch = useAppDispatch();
  const initialViews: View[] = [
    {
      label: 'All',
      value: HomeView.All,
      hidden: displayOptions.hiddenViews.includes(HomeView.All),
    },
    {
      label: 'Recent',
      value: HomeView.Recent,
      hidden: displayOptions.hiddenViews.includes(HomeView.Recent),
    },
    {
      label: 'Watch Later',
      value: HomeView.WatchLater,
      hidden: displayOptions.hiddenViews.includes(HomeView.WatchLater),
    },
  ];
  const [views, setViews] = useState(initialViews);

  useDidMountEffect(() => {
    if (open) {
      setViews(initialViews);
    }
  }, [open]);

  const handleViewToggle = (target: View) => {
    setViews((state) =>
      state.map((view) =>
        view.value === target.value
          ? {
              ...view,
              hidden: !view.hidden,
            }
          : view
      )
    );
  };

  const handleSave = () => {
    dispatch(
      setHomeDisplayOptions({
        hiddenViews: views
          .filter(({ hidden }) => hidden)
          .map(({ value }) => value),
      })
    );
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <DisplaySettingsIcon fontSize="large" />
          <DialogTitle sx={{ padding: 0 }}>Display options</DialogTitle>
        </Box>
        <Box sx={{ pt: 2.5, minWidth: 420 }}>
          <FormControl component="fieldset" variant="standard" focused={false}>
            <FormLabel component="legend">Active views</FormLabel>
            <FormGroup>
              {views.map((view) => (
                <FormControlLabel
                  onClick={() => handleViewToggle(view)}
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
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 2, pb: 2 }}>
        <Button color="inherit" onClick={handleClose} autoFocus>
          Cancel
        </Button>
        <Button color="secondary" variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

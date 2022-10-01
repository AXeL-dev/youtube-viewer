import React, { useRef } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from '@mui/material';
import { useDidMountEffect } from 'hooks/useDidMountEffect';
import { useAppDispatch } from 'store';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import { setHomeDisplayOptions } from 'store/reducers/settings';
import ActiveViews, { ActiveViewsRef } from './ActiveViews';
import ExtraVideoActions, { ExtraVideoActionsRef } from './ExtraVideoActions';

interface DisplayOptionsDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function DisplayOptionsDialog(props: DisplayOptionsDialogProps) {
  const { open, onClose } = props;
  const dispatch = useAppDispatch();
  const activeViewsRef = useRef<ActiveViewsRef>(null);
  const extraVideoActionsRef = useRef<ExtraVideoActionsRef>(null);

  useDidMountEffect(() => {
    if (open) {
      activeViewsRef.current?.reset();
      extraVideoActionsRef.current?.reset();
    }
  }, [open]);

  const handleSave = () => {
    if (activeViewsRef.current && extraVideoActionsRef.current) {
      const views = activeViewsRef.current.getViews();
      const actions = extraVideoActionsRef.current.getActions();
      dispatch(
        setHomeDisplayOptions({
          hiddenViews: views
            .filter(({ hidden }) => hidden)
            .map(({ value }) => value),
          extraVideoActions: actions
            .filter(({ active }) => active)
            .map(({ value }) => value),
        }),
      );
    }
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            pt: 2.5,
            minWidth: 480,
          }}
        >
          <ActiveViews ref={activeViewsRef} />
          <Divider flexItem />
          <ExtraVideoActions ref={extraVideoActionsRef} />
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

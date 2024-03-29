import React from 'react';
import { IconButton } from '@mui/material';
import { useDialog } from 'hooks';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import HomeDisplayOptionsDialog from 'ui/components/pages/Home/DisplayOptionsDialog';

interface HomeActionsProps {}

export function HomeActions(props: HomeActionsProps) {
  const { openedDialog, openDialog, closeDialog } = useDialog();

  return (
    <>
      <IconButton
        aria-label="display-options"
        color="default"
        size="small"
        sx={{
          position: 'absolute',
          right: 0,
          backgroundColor: (theme) => theme.palette.primary.dark,
          color: (theme) => theme.palette.common.white,
        }}
        onClick={() => openDialog('display-options')}
      >
        <DisplaySettingsIcon fontSize="small" />
      </IconButton>
      <HomeDisplayOptionsDialog
        open={openedDialog === 'display-options'}
        onClose={closeDialog}
      />
    </>
  );
}

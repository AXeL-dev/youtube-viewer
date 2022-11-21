import { useState } from 'react';
import { Nullable } from 'types';

type DialogName = Nullable<string>;

export function useDialog(defaultDialog: DialogName = null) {
  const [openedDialog, setOpenedDialog] = useState<DialogName>(defaultDialog);

  const openDialog = (dialog: string) => {
    setOpenedDialog(dialog);
  };

  const closeDialog = () => {
    setOpenedDialog(null);
  };

  return {
    openedDialog,
    openDialog,
    closeDialog,
  };
}

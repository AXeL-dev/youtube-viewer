import React from 'react';
import { Channel } from 'types';
import { useAppDispatch } from 'store';
import { removeChannel } from 'store/reducers/channels';
import RemoveChannelDialog from './RemoveChannelDialog';

interface ChannelDialogsProps {
  channel: Channel;
  openedDialog: string | null;
  onClose: () => void;
}

function ChannelDialogs(props: ChannelDialogsProps) {
  const { channel, openedDialog, onClose } = props;
  const dispatch = useAppDispatch();

  return (
    <RemoveChannelDialog
      open={openedDialog === 'remove-channel'}
      channel={channel}
      onClose={(confirmed) => {
        if (confirmed) {
          dispatch(removeChannel(channel));
        }
        onClose();
      }}
    />
  );
}

export default React.memo(ChannelDialogs);

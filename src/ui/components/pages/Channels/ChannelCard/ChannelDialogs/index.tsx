import React from 'react';
import { Channel, Nullable } from 'types';
import { useAppDispatch } from 'store';
import { removeChannel, setChannelFilters } from 'store/reducers/channels';
import RemoveChannelDialog from './RemoveChannelDialog';
import ChannelFiltersDialog from './ChannelFiltersDialog';

interface ChannelDialogsProps {
  channel: Channel;
  openedDialog: Nullable<string>;
  onClose: () => void;
}

function ChannelDialogs(props: ChannelDialogsProps) {
  const { channel, openedDialog, onClose } = props;
  const dispatch = useAppDispatch();

  return (
    <>
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
      <ChannelFiltersDialog
        open={openedDialog === 'channel-filters'}
        channel={channel}
        onClose={(filters) => {
          if (filters) {
            dispatch(
              setChannelFilters({
                channel,
                filters,
              })
            );
          }
          onClose();
        }}
      />
    </>
  );
}

function propsAreEqual(
  prevProps: ChannelDialogsProps,
  nextProps: ChannelDialogsProps
) {
  return (
    prevProps.openedDialog === nextProps.openedDialog &&
    prevProps.channel.id === nextProps.channel.id
  );
}

export default React.memo(ChannelDialogs, propsAreEqual);

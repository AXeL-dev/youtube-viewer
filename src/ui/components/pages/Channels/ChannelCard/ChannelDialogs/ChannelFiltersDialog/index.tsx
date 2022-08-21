import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Channel, ChannelFilter, ChannelFilterOperator } from 'types';
import { useDidMountEffect } from 'hooks/useDidMountEffect';
import ChannelPicture from 'ui/components/pages/Channels/ChannelCard/ChannelPicture';
import AddIcon from '@mui/icons-material/Add';
import Filter from './Filter';
import { fields } from './config';

interface ChannelFiltersDialogProps {
  open: boolean;
  channel: Channel;
  onClose: (filters?: ChannelFilter[]) => void;
}

export default function ChannelFiltersDialog(props: ChannelFiltersDialogProps) {
  const { open, channel, onClose } = props;
  const [filters, setFilters] = useState<ChannelFilter[]>(
    channel.filters || [],
  );

  useDidMountEffect(() => {
    if (open) {
      setFilters(channel.filters || []);
    }
  }, [open]);

  const handleAddFilter = () => {
    setFilters((state) => [
      ...state,
      {
        field: fields[0],
        operator: ChannelFilterOperator.Contains,
        value: '',
      },
    ]);
  };

  const handleChange = (changes: Partial<ChannelFilter>, index: number) => {
    setFilters((state) =>
      state.map((filter, i) =>
        i === index
          ? {
              ...filter,
              ...changes,
            }
          : filter,
      ),
    );
  };

  const handleRemove = (index: number) => {
    setFilters((state) => state.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onClose(filters);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <Box sx={{ display: 'flex' }}>
          <ChannelPicture channel={channel} />
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              px: 2,
            }}
          >
            <DialogTitle sx={{ px: 0 }}>
              Filter {channel.title}'s channel videos
            </DialogTitle>
          </Box>
        </Box>
        <Box sx={{ pt: 2 }}>
          {filters.map((filter, index) => (
            <Filter
              {...filter}
              key={index}
              onChange={(changes: Partial<ChannelFilter>) =>
                handleChange(changes, index)
              }
              onRemove={() => handleRemove(index)}
            />
          ))}
          <Button
            color="inherit"
            onClick={handleAddFilter}
            startIcon={<AddIcon />}
          >
            Add filter
          </Button>
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

import React, { ChangeEvent } from 'react';
import { Box, IconButton, SelectChangeEvent } from '@mui/material';
import { ChannelFilter, ChannelFilterOperator } from 'types';
import { settingsByField, fields, FilterType } from '../config';
import ClearIcon from '@mui/icons-material/Clear';
import Input from './Input';
import Select from './Select';
import MenuItem from './MenuItem';

interface FilterProps extends ChannelFilter {
  onChange: (changes: Partial<ChannelFilter>) => void;
  onRemove: () => void;
}

export default function Filter(props: FilterProps) {
  const { field, operator, value, onChange, onRemove } = props;
  const settings = settingsByField[field || fields[0]];

  const handleFieldChange = (event: SelectChangeEvent) => {
    onChange({
      field: event.target.value,
    });
  };

  const handleOperatorChange = (event: SelectChangeEvent) => {
    onChange({
      operator: event.target.value as ChannelFilterOperator,
    });
  };

  const handleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({
      value:
        settings.type === FilterType.Number
          ? +event.target.value
          : event.target.value,
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        width: '100%',
        pb: 2,
      }}
    >
      <Select value={field} size="small" onChange={handleFieldChange}>
        {fields.map((label, index) => (
          <MenuItem key={index} value={label}>
            {label}
          </MenuItem>
        ))}
      </Select>
      <Select
        value={
          settings.operators.includes(operator)
            ? operator
            : settings.operators[0]
        }
        size="small"
        onChange={handleOperatorChange}
      >
        {settings.operators.map((operator, index) => (
          <MenuItem key={index} value={operator}>
            {operator}
          </MenuItem>
        ))}
      </Select>
      <Input
        value={value}
        type={settings.type}
        placeholder="value"
        onChange={handleValueChange}
      />
      <IconButton aria-label="remove" size="small" onClick={onRemove}>
        <ClearIcon />
      </IconButton>
    </Box>
  );
}

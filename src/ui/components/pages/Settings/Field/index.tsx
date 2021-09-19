import React, { ChangeEvent } from 'react';
import { Box, Typography } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { SettingType } from 'types';
import Input from './Input';
import Switch from './Switch';
import Select from './Select';
import MenuItem from './MenuItem';

type ValueType = string | number | boolean;

type OptionType = {
  label: string;
  value: number | string;
};

interface FieldProps {
  label: string;
  description?: string | React.ReactNode;
  placeholder?: string;
  options?: OptionType[];
  value: ValueType;
  type: SettingType;
  noBorder?: boolean;
  onChange?: (value: any) => void;
}

export default function Field(props: FieldProps) {
  const {
    label,
    description,
    placeholder,
    options = [],
    value,
    type,
    noBorder,
    onChange,
  } = props;

  const handleChange = (
    event:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
  ) => {
    if (onChange) {
      const value =
        type === SettingType.Boolean
          ? (event.target as HTMLInputElement).checked
          : event.target.value;
      onChange(value);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        borderBottom: noBorder ? 0 : 1,
        borderColor: 'divider',
        py: 2.5,
        pr: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography variant="subtitle1">{label}</Typography>
        {description ? (
          <Typography variant="body2" color="textSecondary">
            {description}
          </Typography>
        ) : null}
      </Box>
      {type === SettingType.String ? (
        <Input
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
        />
      ) : null}
      {type === SettingType.Boolean ? (
        <Switch
          checked={value as boolean}
          onChange={handleChange}
          inputProps={{ 'aria-label': 'checkbox' }}
        />
      ) : null}
      {type === SettingType.List ? (
        <Select value={value as string} size="small" onChange={handleChange}>
          {options.map((option: OptionType, index: number) => (
            <MenuItem key={index} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      ) : null}
    </Box>
  );
}

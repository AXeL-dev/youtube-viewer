import React, { ChangeEvent } from 'react';
import { Box, Typography } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { SettingType } from 'models';
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
  onChange?: (value: ValueType) => void;
}

export default function Field(props: FieldProps) {
  const { label, description, placeholder, options = [], value, type, noBorder, onChange } = props;

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        borderBottom: noBorder ? 0 : '1px solid #e0e0e0',
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
        {description && (
          <Typography variant="body2" color="textSecondary">
            {description}
          </Typography>
        )}
      </Box>
      {type === SettingType.String && <Input defaultValue={value} placeholder={placeholder} onChange={handleChange} />}
      {type === SettingType.Boolean && (
        <Switch defaultChecked={value as boolean} onChange={handleChange} inputProps={{ 'aria-label': 'checkbox' }} />
      )}
      {type === SettingType.List && (
        <Select defaultValue={value as string} size="small" onChange={handleChange}>
          {options.map((option: OptionType, index: number) => (
            <MenuItem key={index} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      )}
    </Box>
  );
}

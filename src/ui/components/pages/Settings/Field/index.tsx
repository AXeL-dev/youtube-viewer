import React, { ChangeEvent } from 'react';
import { Box, Typography, SelectChangeEvent } from '@mui/material';
import { SettingType, Either } from 'types';
import Input from './Input';
import Switch from './Switch';
import Select from './Select';
import MenuItem from './MenuItem';
import Secret from './Secret';

type ValueType = string | number | boolean | null;

type OptionType = {
  label: string;
  value: number | string;
};

interface CommonFieldProps {
  label: string;
  description?: string | React.ReactNode;
  placeholder?: string;
  type: SettingType;
}

interface ControlledFieldProps extends CommonFieldProps {
  value: ValueType;
  options?: OptionType[];
  onChange?: (value: any) => void;
}

interface CustomFieldProps extends CommonFieldProps {
  type: SettingType.Custom;
  render: () => React.ReactNode;
}

type FieldProps = Either<ControlledFieldProps, CustomFieldProps>;

function Field(props: FieldProps) {
  const {
    label,
    description,
    placeholder,
    options = [],
    value,
    type,
    onChange,
    render,
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

  const renderField = () => {
    switch (type) {
      case SettingType.String:
        return (
          <Input
            value={value}
            placeholder={placeholder}
            onChange={handleChange}
          />
        );
      case SettingType.Secret:
        return (
          <Secret
            value={value as string}
            placeholder={placeholder}
            onChange={handleChange}
          />
        );
      case SettingType.Boolean:
        return (
          <Switch
            checked={value as boolean}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'checkbox' }}
          />
        );
      case SettingType.List:
        return (
          <Select value={value as string} size="small" onChange={handleChange}>
            {options.map((option: OptionType, index: number) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        );
      case SettingType.Custom:
        return render!();
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        py: 2.5,
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
      {renderField()}
    </Box>
  );
}

export const ControlledField = (props: ControlledFieldProps) => (
  <Field {...props} />
);

export const CustomField = (props: Omit<CustomFieldProps, 'type'>) => (
  <Field {...props} type={SettingType.Custom} />
);

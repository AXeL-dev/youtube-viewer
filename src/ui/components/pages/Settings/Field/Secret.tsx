import React, { useState } from 'react';
import { InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { noop } from 'helpers/utils';
import Input from './Input';

interface ISecretProps {
  value: string;
  placeholder?: string;
  onChange?: (value: any) => void;
}

export default function Secret(props: ISecretProps) {
  const [isSecretVisible, setSecretVisibility] = useState(false);

  const toggleSecretVisibility = () => {
    setSecretVisibility(!isSecretVisible);
  };

  return (
    <Input
      {...props}
      type={isSecretVisible ? 'text' : 'password'}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle visibility"
            onClick={toggleSecretVisibility}
            onMouseDown={noop}
            edge="end"
          >
            {isSecretVisible ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      }
    />
  );
}

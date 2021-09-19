import React from 'react';
import { Box, IconButton } from '@mui/material';
import { debounce } from 'helpers/utils';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import Input from './Input';

interface SearchInputProps {
  placeholder?: string;
  width?: string | number;
  clearable?: boolean;
  debounceTime?: number;
  onChange: (value: string) => void;
  onClear?: () => void;
}

export function SearchInput(props: SearchInputProps) {
  const {
    placeholder = 'Search…',
    width: maxWidth,
    clearable,
    debounceTime = 300,
    onChange,
    onClear,
  } = props;
  const [value, setValue] = React.useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleClear = () => {
    setValue('');
    if (onClear) {
      onClear();
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onChange(value);
    }
  };

  const debounceChange = React.useMemo(
    () =>
      debounce((value: string) => {
        onChange(value);
      }, debounceTime),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  React.useEffect(() => {
    if (value === '') {
      return;
    }

    debounceChange(value);
  }, [value, debounceChange]);

  return (
    <Box sx={{ position: 'relative', display: 'flex', flexGrow: 1, maxWidth }}>
      <Box
        sx={{
          width: 48,
          height: '100%',
          position: 'absolute',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'action.active',
          zIndex: 1,
        }}
      >
        <SearchIcon />
      </Box>
      <Input
        placeholder={placeholder}
        inputProps={{ value, 'aria-label': 'search' }}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
      />
      {clearable && value?.length > 0 ? (
        <IconButton
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            my: 0.75,
            mx: 1,
            color: 'action.active',
          }}
          aria-label="clear"
          size="small"
          onClick={handleClear}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      ) : null}
    </Box>
  );
}

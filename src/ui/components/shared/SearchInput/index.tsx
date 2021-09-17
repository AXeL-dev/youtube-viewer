import React from 'react';
import { Box, IconButton } from '@mui/material';
import { debounce } from 'helpers/utils';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import Input from './Input';

interface SearchInputProps {
  onChange: (value: string) => void;
  placeholder?: string;
  width?: string | number;
  clearable?: boolean;
}

export function SearchInput(props: SearchInputProps) {
  const { placeholder = 'Search…', width, clearable, onChange } = props;
  const [value, setValue] = React.useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const lazyChange = React.useMemo(
    () =>
      debounce((input: { value: string }) => {
        onChange(input.value);
      }, 300),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  React.useEffect(() => {
    if (value === '') {
      return;
    }

    lazyChange({ value: value });
  }, [value, lazyChange]);

  return (
    <Box sx={{ position: 'relative', display: 'flex', flexGrow: 1, width }}>
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
      <Input placeholder={placeholder} inputProps={{ value, 'aria-label': 'search' }} onChange={handleChange} />
      {clearable && value?.length > 0 && (
        <IconButton
          sx={{ position: 'absolute', right: 0, top: 0, my: 0.75, mx: 1, color: 'action.active' }}
          aria-label="clear"
          size="small"
          onClick={() => setValue('')}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      )}
    </Box>
  );
}

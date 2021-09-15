import React from 'react';
import { InputBase, IconButton } from '@material-ui/core';
import { debounce } from 'helpers/utils';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import { useStyles } from './styles';

interface SearchInputProps {
  onChange: (value: string) => void;
  placeholder?: string;
  width?: number;
}

export function SearchInput(props: SearchInputProps) {
  const { placeholder = 'Search…', width, onChange } = props;
  const classes = useStyles();
  const [value, setValue] = React.useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const lazyChange = React.useMemo(
    () =>
      debounce((input: { value: string }) => {
        //console.log(input);
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
    <div className={classes.search} style={{ width }}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder={placeholder}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ value, 'aria-label': 'search' }}
        onChange={handleChange}
      />
      {value?.length > 0 && (
        <IconButton aria-label="clear" size="small" className={classes.clearButton} onClick={() => setValue('')}>
          <CloseIcon fontSize="inherit" />
        </IconButton>
      )}
    </div>
  );
}

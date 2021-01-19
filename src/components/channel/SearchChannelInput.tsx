import React from 'react';
import useAutocomplete from '@material-ui/lab/useAutocomplete';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { searchChannel } from '../../helpers/youtube';
import Avatar from '@material-ui/core/Avatar';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { Channel } from '../../models';
import { getRegex, debounce } from '../../helpers/utils';
import { RawHTML } from '../shared';
import { useStyles } from './SearchChannelInput.styles';

interface SearchChannelInputProps {
  onSelect: Function;
  onError: Function;
}

export function SearchChannelInput(props: SearchChannelInputProps) {
  const { onSelect, onError } = props;
  const classes = useStyles();
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState<Channel[]>([]);
  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
  } = useAutocomplete({
    id: 'search-autocomplete',
    options: options,
    getOptionLabel: option => {
      //console.log(option);
      if (option?.title) {
        setInputValue(option.title);
        return option.title;
      }
      return option;
    },
    value: inputValue,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const fetch = React.useMemo(
    () =>
      debounce((input: any, callback: Function) => {
        //console.log(input);
        searchChannel(input.value, 5).then((results: Channel[]) => {
          //console.log(results);
          callback(results);
        }).catch((error) => {
          onError(error);
        });
      }, 200),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  React.useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setOptions([]);
      return undefined;
    }

    fetch({ value: inputValue }, (results?: Channel[]) => {
      if (active) {
        setOptions(results || []);
      }
    });

    return () => {
      active = false;
    };
  }, [inputValue, fetch]);

  return (
    <div className={classes.search}>
      <div {...getRootProps()}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Search for a channel…"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ ...getInputProps(), 'aria-label': 'search' }}
          onChange={handleChange}
        />
        {inputValue?.length > 0 && (
          <IconButton aria-label="clear" size="small" className={classes.clearButton} onClick={() => setInputValue('')}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        )}
      </div>
      {groupedOptions.length > 0 ? (
        <div className={classes.poper}>
          <ul className={classes.listbox} {...getListboxProps()}>
            {groupedOptions.map((option, index) => (
              <li {...getOptionProps({ option, index })}>
                <Grid container alignItems="center" onClick={() => onSelect(option)}>
                  <Grid item>
                    <Avatar className={classes.avatar} alt={option.title} src={option.thumbnail} />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="body2" color="textSecondary">
                      <RawHTML>{option.title.replace(getRegex('(' + inputValue + ')', 'gi'), `<strong>$1</strong>`)}</RawHTML>
                    </Typography>
                  </Grid>
                </Grid>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

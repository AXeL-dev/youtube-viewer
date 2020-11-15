import React from 'react';
import useAutocomplete from '@material-ui/lab/useAutocomplete';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme, fade } from '@material-ui/core/styles';
import { searchChannel } from '../../helpers/youtube';
import Avatar from '@material-ui/core/Avatar';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { Channel } from '../../models/Channel';
import { getRegex, debounce } from '../../helpers/utils';
import { RawHTML } from '../shared/RawHTML';

const useStyles = makeStyles((theme: Theme) => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(6),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    margin: theme.spacing(0.75),
    color: theme.palette.common.white,
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 4, 1, 6),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 200,
      '&:focus': {
        width: 260,
      },
    },
  },
  poper: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    margin: '4px 0',
    overflow: 'hidden',
    borderRadius: '4px',
    boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
  },
  listbox: {
    position: 'relative',
    margin: 0,
    padding: '8px 0',
    border: 'none',
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    maxHeight: '40vh',
    '& li': {
      padding: '6px 16px'
    },
    '& li[data-focus="true"]': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
      cursor: 'pointer',
    },
    '& li:active': {
      backgroundColor: 'rgba(0, 0, 0, 0.14)'
    },
  },
  avatar: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
}));

interface SearchProps {
  onSelect: Function;
  onError: Function;
}

export default function SearchChannelInput(props: SearchProps) {
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

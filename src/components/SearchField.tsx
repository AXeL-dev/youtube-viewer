import React from 'react';
import useAutocomplete from '@material-ui/lab/useAutocomplete';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme, fade } from '@material-ui/core/styles';
import throttle from 'lodash/throttle';
import { search_channel } from '../helpers/youtube';
import Avatar from '@material-ui/core/Avatar';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { Channel } from '../models/Channel';

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
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 200,
      '&:focus': {
        width: 300,
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
}

export default function SearchField(props: SearchProps) {
  const { onSelect } = props;
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
    getOptionLabel: option => option.title,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const fetch = React.useMemo(
    () =>
      throttle((input: any, callback: Function) => {
        //console.log(input);
        search_channel(input.value, 5).then((results: Channel[]) => {
          //console.log(results);
          callback(results);
        });
      }, 200),
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
      </div>
      {groupedOptions.length > 0 ? (
        <div className={classes.poper}>
          <ul className={classes.listbox} {...getListboxProps()}>
            {groupedOptions.map((option, index) => (
              <li {...getOptionProps({ option, index })}>
                <Grid container alignItems="center" onClick={(event) => onSelect(option)}>
                  <Grid item>
                    <Avatar className={classes.avatar} alt={option.title} src={option.thumbnail} />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="body2" color="textSecondary">
                      {option.title}
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

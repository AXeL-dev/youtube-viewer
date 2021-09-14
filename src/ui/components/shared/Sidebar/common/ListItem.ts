import { Theme, withStyles } from '@material-ui/core/styles';
import MuiListItem from '@material-ui/core/ListItem';

const ListItemSelectedStyle = (theme: Theme) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  '& .MuiListItemIcon-root': {
    color: '#fff',
  },
});

const ListItem = withStyles((theme: Theme) => ({
  root: {
    borderRadius: '5px 0 0 5px',
    marginBottom: theme.spacing(1),
    '&$selected': ListItemSelectedStyle(theme),
    '&$selected:hover': ListItemSelectedStyle(theme),
  },
  selected: {},
}))(MuiListItem) as typeof MuiListItem;

export default ListItem;

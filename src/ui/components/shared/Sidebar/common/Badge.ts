import { Theme, withStyles } from '@material-ui/core/styles';
import MuiBadge from '@material-ui/core/Badge';

const Badge = withStyles((theme: Theme) => ({
  root: {},
  badge: {
    // display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'center',
    height: 24,
    fontSize: '0.85rem',
    marginLeft: theme.spacing(2),
    padding: theme.spacing(0, 1.25),
    borderRadius: theme.spacing(1.5),
    left: 0,
    right: 'auto',
  },
}))(MuiBadge);

export default Badge;

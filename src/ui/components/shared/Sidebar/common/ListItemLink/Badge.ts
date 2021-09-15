import { Theme, withStyles } from '@material-ui/core/styles';
import MuiBadge from '@material-ui/core/Badge';

const Badge = withStyles((theme: Theme) => ({
  root: {},
  badge: {
    minWidth: 24,
    height: 24,
    fontSize: '0.75rem',
    marginLeft: theme.spacing(2),
    borderRadius: theme.spacing(1.5),
    left: 0,
    right: 'auto',
  },
}))(MuiBadge);

export default Badge;

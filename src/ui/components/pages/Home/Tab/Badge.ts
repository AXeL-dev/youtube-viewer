import { styled } from '@mui/material/styles';
import MuiBadge from '@mui/material/Badge';

const Badge = styled(MuiBadge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    position: 'relative',
    transform: 'none',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    minWidth: 20,
    height: 20,
    fontSize: '0.75rem',
    marginLeft: theme.spacing(1.5),
    borderRadius: theme.spacing(1.5),
  },
}));

export default Badge;

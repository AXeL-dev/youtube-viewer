import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  breadcrumb: {
    marginBottom: theme.spacing(2.5),
  },
  divider: {
    marginBottom: theme.spacing(2.5),
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    outline: 'none',
    '&:hover': {
      backgroundColor: 'transparent'
    },
  },
  title: {
    marginLeft: theme.spacing(1),
  },
  youtube: {
    '&:hover': {
      color: '#f44336',
    },
  },
  box: {
    '&:last-child': {
      '& hr.divider': {
        display: 'none'
      }
    }
  }
}));

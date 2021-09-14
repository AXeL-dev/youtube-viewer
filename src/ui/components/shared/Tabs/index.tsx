import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import MuiTabs from '@material-ui/core/Tabs';
import MuiTab from '@material-ui/core/Tab';

export const Tabs = withStyles((theme: Theme) => ({
  root: {
    borderBottom: '1px solid #e8e8e8',
    padding: theme.spacing(1, 3, 0, 3),
  },
  indicator: {
    backgroundColor: theme.palette.primary.main,
  },
}))(MuiTabs);

interface StyledTabProps {
  label: string;
}

export const Tab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: 'none',
      minWidth: 72,
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: theme.spacing(4),
      // fontFamily: [
      //   '-apple-system',
      //   'BlinkMacSystemFont',
      //   '"Segoe UI"',
      //   'Roboto',
      //   '"Helvetica Neue"',
      //   'Arial',
      //   'sans-serif',
      //   '"Apple Color Emoji"',
      //   '"Segoe UI Emoji"',
      //   '"Segoe UI Symbol"',
      // ].join(','),
      '&:hover': {
        color: theme.palette.primary.main,
        opacity: 1,
      },
      '&$selected': {
        color: theme.palette.primary.main,
        fontWeight: theme.typography.fontWeightMedium,
      },
      '&:focus': {
        color: theme.palette.primary.main,
      },
    },
    selected: {},
  })
)((props: StyledTabProps) => <MuiTab disableRipple {...props} />);

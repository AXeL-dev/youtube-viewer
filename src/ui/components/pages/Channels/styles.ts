import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      padding: theme.spacing(1.5, 3, 1.5, 2),
      borderBottom: '1px solid #e8e8e8',
    },
    body: {
      overflow: 'auto',
      padding: theme.spacing(0, 3),
    },
  })
);

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    heartIcon: {
      color: '#e25555',
      fontSize: 16,
      verticalAlign: 'middle',
    },
  })
);

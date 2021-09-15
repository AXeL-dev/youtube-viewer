import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    logo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      cursor: 'default',
      userSelect: 'none',
      '& > img': {
        width: 32,
        height: 32,
        filter: 'contrast(150%) brightness(100%)',
      },
    },
    title: {
      display: 'flex',
      alignItems: 'center',
      color: 'rgba(0, 0, 0, 0.7)',
    },
    version: {
      marginLeft: theme.spacing(1),
      backgroundColor: '#eee',
      padding: '3px 6px',
      border: '1px solid #e8e8e8',
      borderRadius: '4px',
      color: 'rgba(0, 0, 0, 0.7)',
      fontSize: '0.75rem',
      lineHeight: 1,
    },
  })
);

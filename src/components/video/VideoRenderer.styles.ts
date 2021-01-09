import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  anchor: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'inline-block',
    '&:hover': {
      textDecoration: 'none',
    }
  },
  imageContainer: {
    position: 'relative',
    '&:hover .overlay': {
      opacity: 1,
    },
    '&:hover .options': {
      top: '50%',
      left: '50%',
      opacity: 1,
    }
  },
  image: {
    width: 210,
    height: 118,
    display: 'inherit'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    position: 'absolute',
    height: '100%',
    width: '100%',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    opacity: 0,
    transition: 'all 0.4s ease-in-out 0s',
  },
  options: {
    position: 'absolute',
    textAlign: 'center',
    paddingLeft: '1em',
    paddingRight: '1em',
    width: '100%',
    top: '50%',
    left: '50%',
    opacity: 0,
    transform: 'translate(-50%, -50%)',
    transition: 'all 0.3s ease-in-out 0s',
  },
  optionsButton: {
    color: '#fff',
    margin: theme.spacing(0.5),
  },
  optionsIcon: {
    fontSize: '1.5em',
    //verticalAlign: 'middle',
    '&.bigger': {
      fontSize: '2.1em',
    }
  },
  visibilityIconBox: {
    display: 'flex',
    position: 'absolute',
    bottom: 0,
    left: 0,
    margin: '4px',
    color: '#eee',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: '3px 5px',
    borderRadius: '2px',
    '&:hover': {
      color: '#fff'
    }
  },
  visibilityIcon: {
    fontSize: '1.22em',
  },
  duration: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: '4px',
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: '2px 4px',
    borderRadius: '2px'
  }
}));

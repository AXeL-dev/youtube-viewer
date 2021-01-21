import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export const getListStyle = (isDraggingOver: boolean) => ({
  //background: isDraggingOver ? 'lightblue' : 'lightgrey',
});

export const getListItemStyle = (isDragging: boolean, isHidden: boolean, draggableStyle: any) => ({
  // styles we need to apply on draggables
  ...draggableStyle,
  ...(isDragging && {
    background: "rgb(235,235,235)"
  }),
  ...(isHidden && {
    opacity: 0.5,
    textDecoration: "line-through"
  })
});

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    channelsOptionsIcon: {
      top: '50%',
      right: '16px',
      position: 'absolute',
      transform: 'translateY(-50%)',
    },
    menuIcon: {
      fontSize: 20,
      marginRight: theme.spacing(1),
      verticalAlign: 'middle',
    },
    subheader: {
      position: 'relative',
    }
  }),
);

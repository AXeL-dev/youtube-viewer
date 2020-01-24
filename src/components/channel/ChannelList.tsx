import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';
import CachedIcon from '@material-ui/icons/Cached';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';
import RootRef from '@material-ui/core/RootRef';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Channel } from '../../models/Channel';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    settingsButton: {
      top: '50%',
      right: '16px',
      position: 'absolute',
      transform: 'translateY(-50%)',
    },
  }),
);

const getListStyle = (isDraggingOver: boolean) => ({
  //background: isDraggingOver ? 'lightblue' : 'lightgrey',
});

const getListItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // styles we need to apply on draggables
  ...draggableStyle,

  ...(isDragging && {
    background: "rgb(235,235,235)"
  })
});

interface ChannelListProps {
  channels: Channel[];
  selectedChannelIndex: number;
  onDragEnd: Function;
  onOpenSettings: Function;
  onShowAll: Function;
  onRefresh: Function;
  onSelect: Function;
  onDelete: Function;
}

export function ChannelList(props: ChannelListProps) {
  const { channels, selectedChannelIndex = -1, onDragEnd, onOpenSettings, onShowAll, onRefresh, onSelect, onDelete } = props;
  const classes = useStyles();

  return (
    <DragDropContext onDragEnd={(event) => onDragEnd(event)}>
      <Droppable droppableId="droppable">
      {(provided: any, snapshot: any) => (
        <RootRef rootRef={provided.innerRef}>
          <List
            dense
            subheader={<ListSubheader>Channels
              <Tooltip title="Settings" aria-label="settings">
                <IconButton edge="end" aria-label="settings" size="small" className={classes.settingsButton} onClick={(event) => onOpenSettings(event)}>
                  <SettingsIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </ListSubheader>}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            <ListItem button key="all" selected={selectedChannelIndex === -1} onClick={() => onShowAll()}>
              <ListItemIcon>
                <Badge color="secondary" badgeContent={channels.length}>
                  <Avatar>
                    <SubscriptionsIcon />
                  </Avatar>
                </Badge>
              </ListItemIcon>
              <ListItemText primary="All" />
              {channels?.length > 0 && <ListItemSecondaryAction>
                <Tooltip title="Refresh" aria-label="refresh">
                  <IconButton edge="end" aria-label="refresh" size="small" onClick={(event) => onRefresh(event)}>
                    <CachedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>}
            </ListItem>
            {channels.map((channel: Channel, index: number) => (
              <Draggable key={channel.id} draggableId={channel.id} index={index}>
              {(provided: any, snapshot: any) => (
                <ListItem
                  ContainerProps={{ ref: provided.innerRef }}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={getListItemStyle(
                    snapshot.isDragging,
                    provided.draggableProps.style
                  )}
                  button
                  selected={index === selectedChannelIndex}
                  onClick={() => onSelect(channel, index)}
                >
                  <ListItemIcon><Avatar alt={channel.title} src={channel.thumbnail} /></ListItemIcon>
                  <ListItemText primary={channel.title} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" size="small" onClick={(event) => onDelete(event, channel, index)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              )}
              </Draggable>
            ))}
            {provided.placeholder}
          </List>
        </RootRef>
      )}
      </Droppable>
    </DragDropContext>
  )
}

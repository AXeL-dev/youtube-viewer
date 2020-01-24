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
import CachedIcon from '@material-ui/icons/Cached';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';
import RootRef from '@material-ui/core/RootRef';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Channel } from '../../models/Channel';
import { DeleteChannelDialog } from './DeleteChannelDialog';
import { SettingsDialog } from '../settings/SettingsDialog';
import { SettingsSnackbar } from '../settings/SettingsSnackbar';
import { Settings } from '../../models/Settings';

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

// a little function to help us with reordering the dnd result
const reorder = (list: any, startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

interface ChannelListProps {
  channels: Channel[];
  settings: Settings;
  selectedChannelIndex: number;
  onShowAll: Function;
  onRefresh: Function;
  onSelect: Function;
  onDelete: Function;
  onSave: Function;
  onSaveSettings: Function;
}

export function ChannelList(props: ChannelListProps) {
  const { channels, settings, selectedChannelIndex = -1, onShowAll, onRefresh, onSelect, onDelete, onSave, onSaveSettings } = props;
  const classes = useStyles();
  const [openDeleteChannelDialog, setOpenDeleteChannelDialog] = React.useState(false);
  const [channelToDelete, setChannelToDelete] = React.useState<Channel>();
  const [channelToDeleteIndex, setChannelToDeleteIndex] = React.useState(0);
  const [openSettingsDialog, setOpenSettingsDialog] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openedMenuIndex, setOpenedMenuIndex] = React.useState(-1);

  const onDragEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    moveChannel(result.source.index, result.destination.index);
  };

  const moveChannel = (indexFrom: number, indexTo: number) => {
    closeMenu();

    const items: Channel[] = reorder(
      channels,
      indexFrom,
      indexTo
    ) as Channel[];

    //console.log(items);
    onSave(items);
  };

  const deleteChannel = (channel: Channel, index: number) => {
    closeMenu();
    setChannelToDelete(channel);
    setChannelToDeleteIndex(index);
    setOpenDeleteChannelDialog(true);
  };

  const confirmDeleteChannel = () => {
    onDelete(channelToDeleteIndex);
    closeDeleteChannelDialog();
  };

  const closeDeleteChannelDialog = () => {
    setOpenDeleteChannelDialog(false);
  };

  const openSettings = (event: any) => {
    event.stopPropagation();
    setOpenSettingsDialog(true);
  };

  const closeSettings = () => {
    setOpenSettingsDialog(false);
  };

  const saveSettings = () => {
    // Update settings
    onSaveSettings({
      videosPerChannel: +(document.getElementById('videosPerChannel') as any).value,
      videosAnteriority: +(document.getElementById('videosAnteriority') as any).value,
      apiKey: (document.getElementById('apiKey') as any).value
    });
    closeSettings();
    setOpenSnackbar(true);
  };

  const closeSnackbar = () => {
    setOpenSnackbar(false);
  };

  const openMenu = (event: any, index: number) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setOpenedMenuIndex(index);
  };

  const closeMenu = () => {
    setAnchorEl(null);
    setOpenedMenuIndex(-1);
  };

  return (
    <React.Fragment>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
        {(provided: any, snapshot: any) => (
          <RootRef rootRef={provided.innerRef}>
            <List
              dense
              subheader={<ListSubheader>Channels
                <Tooltip title="Settings" aria-label="settings">
                  <IconButton edge="end" aria-label="settings" size="small" className={classes.settingsButton} onClick={(event) => openSettings(event)}>
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
                      <IconButton edge="end" aria-label="more" size="small" onClick={(event) => openMenu(event, index)}>
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                      <Menu
                        id={"menu-" + index}
                        anchorEl={anchorEl}
                        keepMounted
                        open={openedMenuIndex === index}
                        onClose={closeMenu}
                      >
                        {index > 0 && <MenuItem onClick={() => moveChannel(index, index - 1)}>Move up</MenuItem>}
                        {index < channels.length - 1 && <MenuItem onClick={() => moveChannel(index, index + 1)}>Move down</MenuItem>}
                        <MenuItem onClick={() => deleteChannel(channel, index)}>Delete</MenuItem>
                      </Menu>
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
      <DeleteChannelDialog
        open={openDeleteChannelDialog}
        channel={channelToDelete}
        onConfirm={confirmDeleteChannel}
        onClose={closeDeleteChannelDialog}
      />
      <SettingsDialog settings={settings} open={openSettingsDialog} onClose={closeSettings} onSave={saveSettings} />
      <SettingsSnackbar open={openSnackbar} onClose={closeSnackbar} onRefresh={onRefresh} />
    </React.Fragment>
  )
}
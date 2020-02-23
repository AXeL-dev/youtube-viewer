import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';
import RefreshIcon from '@material-ui/icons/Refresh';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import GetAppIcon from '@material-ui/icons/GetApp';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';
import RootRef from '@material-ui/core/RootRef';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Channel } from '../../models/Channel';
import { ConfirmationDialog } from '../shared/ConfirmationDialog';
import { ImportDialog } from '../shared/ImportDialog';
import { download } from '../../helpers/download';

const useStyles = makeStyles((theme: Theme) =>
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
  selectedIndex: number;
  onShowAll: Function;
  onRefresh: Function;
  onSelect: Function;
  onDelete: Function;
  onSave: Function;
  onSelectedIndexChange: Function;
  cacheSize: string;
  onClearCache: Function;
  onImport: Function;
}

export function ChannelList(props: ChannelListProps) {
  const { channels, selectedIndex = -1, onShowAll, onRefresh, onSelect, onDelete, onSave, onSelectedIndexChange, cacheSize, onClearCache, onImport } = props;
  const classes = useStyles();
  const [openDeleteChannelDialog, setOpenDeleteChannelDialog] = React.useState(false);
  const [channelToDelete, setChannelToDelete] = React.useState<Channel>();
  const [channelToDeleteIndex, setChannelToDeleteIndex] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openedMenuIndex, setOpenedMenuIndex] = React.useState<number|string>(-1);
  const [openClearCacheDialog, setOpenClearCacheDialog] = React.useState(false);
  const [openImportChannelsDialog, setOpenImportChannelsDialog] = React.useState(false);

  const onDragEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    moveChannel(result.source.index, result.destination.index);
  };

  const getSelectedChannel = (): Channel | undefined => channels.find((_, i) => i === selectedIndex);

  const moveChannel = (indexFrom: number, indexTo: number) => {
    closeMenu();
    const selectedChannel = getSelectedChannel();
    const items: Channel[] = reorder(
      channels,
      indexFrom,
      indexTo
    ) as Channel[];
    //console.log(items);
    onSave(items);
    if (selectedChannel) {
      onSelectedIndexChange(items.indexOf(selectedChannel));
    }
  };

  const deleteChannel = (channel: Channel, index: number) => {
    closeMenu();
    setChannelToDelete(channel);
    setChannelToDeleteIndex(index);
    setOpenDeleteChannelDialog(true);
  };

  const confirmDeleteChannel = () => {
    const selectedChannel = getSelectedChannel();
    onDelete(channelToDeleteIndex);
    if (selectedChannel && selectedIndex !== channelToDeleteIndex) {
      onSelectedIndexChange(channels.filter((_, i) => i !== channelToDeleteIndex).indexOf(selectedChannel));
    }
    closeDeleteChannelDialog();
  };

  const closeDeleteChannelDialog = () => {
    setOpenDeleteChannelDialog(false);
  };

  const openMenu = (event: any, index: number|string) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setOpenedMenuIndex(index);
  };

  const closeMenu = () => {
    setAnchorEl(null);
    setOpenedMenuIndex(-1);
  };

  const confirmClearCache = () => {
    onClearCache();
    closeClearCacheDialog();
  };

  const closeClearCacheDialog = () => {
    setOpenClearCacheDialog(false);
  };

  const exportChannels = () => {
    closeMenu();
    const data = JSON.stringify(channels, null, 4);
    const file = new Blob([data], {type: 'text/json'});
    download(file, 'channels.json');
  };

  const importChannels = () => {
    closeMenu();
    setOpenImportChannelsDialog(true);
  };

  const closeImportChannelsDialog = () => {
    setOpenImportChannelsDialog(false);
  };

  const confirmImportChannels = (channelsList: Channel[]) => {
    onImport(channelsList);
    closeImportChannelsDialog();
  };

  const clearCache = () => {
    closeMenu();
    setOpenClearCacheDialog(true);
  };

  return (
    <React.Fragment>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
        {(provided: any, snapshot: any) => (
          <RootRef rootRef={provided.innerRef}>
            <List
              dense
              subheader={<ListSubheader className={classes.subheader}>Channels
                <IconButton edge="end" aria-label="channels-options" size="small" className={classes.channelsOptionsIcon} onClick={(event) => openMenu(event, 'channels-options')}>
                  <MoreVertIcon fontSize="small" />
                </IconButton>
                <Menu
                  id="menu-channels-options"
                  anchorEl={anchorEl}
                  keepMounted
                  open={openedMenuIndex === 'channels-options'}
                  onClose={closeMenu}
                >
                  <MenuItem onClick={() => exportChannels()}><GetAppIcon className={classes.menuIcon} /> Export</MenuItem>
                  <MenuItem onClick={() => importChannels()}><ImportExportIcon className={classes.menuIcon} />Import</MenuItem>
                  <Tooltip title={"Cache size: " + cacheSize} aria-label="clear-cache">
                    <MenuItem onClick={() => clearCache()}><DeleteSweepIcon className={classes.menuIcon} />Clear cache</MenuItem>
                  </Tooltip>
                </Menu>
              </ListSubheader>}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              <ListItem button key="all" selected={selectedIndex === -1} onClick={() => onShowAll()}>
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
                      <RefreshIcon fontSize="small" />
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
                    selected={index === selectedIndex}
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
                        {index > 0 && <MenuItem onClick={() => moveChannel(index, index - 1)}><KeyboardArrowUpIcon className={classes.menuIcon} />Move up</MenuItem>}
                        {index < channels.length - 1 && <MenuItem onClick={() => moveChannel(index, index + 1)}><KeyboardArrowDownIcon className={classes.menuIcon} />Move down</MenuItem>}
                        <MenuItem onClick={() => deleteChannel(channel, index)}><DeleteIcon className={classes.menuIcon} /> Delete</MenuItem>
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
      <ConfirmationDialog
        open={openClearCacheDialog}
        title="Clear cache"
        description="This action is irreversible, would you like to continue?"
        confirmButtonText="Clear"
        onClose={closeClearCacheDialog}
        onConfirm={confirmClearCache}
      />
      <ConfirmationDialog
        open={openDeleteChannelDialog}
        title="Delete Channel"
        description={"Would you like to delete <strong>" + channelToDelete?.title + "</strong> channel?"}
        confirmButtonText="Delete"
        onClose={closeDeleteChannelDialog}
        onConfirm={confirmDeleteChannel}
      />
      <ImportDialog
        open={openImportChannelsDialog}
        title="Import Channels"
        description="Copy & paste below the content of <strong>channels.json</strong> file. Notice that your current channels list will be overrided!"
        textFieldId="channels-to-import"
        textFieldLabel="Channels (json)"
        onClose={closeImportChannelsDialog}
        onConfirm={confirmImportChannels}
      />
    </React.Fragment>
  )
}

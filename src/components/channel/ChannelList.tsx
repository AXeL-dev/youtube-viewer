import React from 'react';
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
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';
import RootRef from '@material-ui/core/RootRef';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Channel, ChannelSelection } from '../../models/Channel';
import { ConfirmationDialog } from '../shared/ConfirmationDialog';
import { ImportDialog } from '../shared/ImportDialog';
import { MoveToPositionDialog } from '../shared/MoveToPositionDialog';
import { download } from '../../helpers/download';
import { isWebExtension, createTab, isFirefox } from '../../helpers/browser';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import ControlCameraIcon from '@material-ui/icons/ControlCamera';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import TodayIcon from '@material-ui/icons/Today';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import { useStyles } from './ChannelList.styles';
import { memorySizeOf } from '../../helpers/utils';
import { useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { cacheAtom } from '../../atoms/cache';
import { openSnackbarAtom } from '../../atoms/snackbar';
import { SnackbarOptions } from '../../models/Snackbar';

const getListStyle = (isDraggingOver: boolean) => ({
  //background: isDraggingOver ? 'lightblue' : 'lightgrey',
});

const getListItemStyle = (isDragging: boolean, isHidden: boolean, draggableStyle: any) => ({
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

// a little function to help us with reordering the dnd result
const reorder = (list: any, startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

interface ChannelListProps {
  className?: string;
  channels: Channel[];
  selectedIndex: number;
  todaysVideosCount: number;
  recentVideosCount: number;
  watchLaterVideosCount: number;
  onShowAll: Function;
  onShowTodaysVideos: Function;
  onShowRecentVideos: Function;
  onShowWatchLaterVideos: Function;
  onRefresh: Function;
  onSelect: Function;
  onDelete: Function;
  onSave: Function;
  onSelectedIndexChange: Function;
  onClearRecentVideos: Function;
  onAddVideosToWatchLater: Function;
  onClearWatchLaterVideos: Function;
  onImport: Function;
}

export function ChannelList(props: ChannelListProps) {
  const { className, channels, selectedIndex = ChannelSelection.All,
          todaysVideosCount, recentVideosCount, watchLaterVideosCount,
          onShowAll, onShowTodaysVideos, onShowRecentVideos, onShowWatchLaterVideos,
          onRefresh, onSelect, onDelete, onSave, onSelectedIndexChange, onClearRecentVideos,
          onAddVideosToWatchLater, onClearWatchLaterVideos, onImport } = props;
  const classes = useStyles();
  const [cache, setCache] = useAtom(cacheAtom);
  const openSnackbar = useUpdateAtom<null, SnackbarOptions>(openSnackbarAtom);
  const [openDeleteChannelDialog, setOpenDeleteChannelDialog] = React.useState(false);
  const [channelToDelete, setChannelToDelete] = React.useState<Channel>();
  const [channelToDeleteIndex, setChannelToDeleteIndex] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openedMenuIndex, setOpenedMenuIndex] = React.useState<number|string>(-1);
  const [openClearCacheDialog, setOpenClearCacheDialog] = React.useState(false);
  const [openClearRecentVideosDialog, setOpenClearRecentVideosDialog] = React.useState(false);
  const [openClearWatchLaterVideosDialog, setOpenClearWatchLaterVideosDialog] = React.useState(false);
  const [openImportChannelsDialog, setOpenImportChannelsDialog] = React.useState(false);
  const [moveToPositionChannelIndex, setMoveToPositionChannelIndex] = React.useState<number>(-1);

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

  const openChannel = (channel: Channel) => {
    closeMenu();
    if (isWebExtension()) {
      createTab(channel.url);
    } else {
      window.open(channel.url, '_blank');
    }
  };

  const refreshChannel = (channel: Channel, index: number) => {
    closeMenu();
    onSelect(channel, index, true);
  };

  const setChannel = (channel: Channel, index: number) => {
    closeMenu();
    channels[index] = channel;
    onSave([...channels]);
    if (selectedIndex < 0 && selectedIndex !== ChannelSelection.None) {
      onRefresh(selectedIndex);
    }
  };

  const hideChannel = (channel: Channel, index: number) => {
    channel.isHidden = true;
    setChannel(channel, index);
  };

  const unhideChannel = (channel: Channel, index: number) => {
    channel.isHidden = false;
    setChannel(channel, index);
  };

  const disableChannelNotifications = (channel: Channel, index: number) => {
    channel.notificationsDisabled = true;
    setChannel(channel, index);
  };

  const enableChannelNotifications = (channel: Channel, index: number) => {
    channel.notificationsDisabled = false;
    setChannel(channel, index);
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
    setCache({});
    openSnackbar({
      message: 'Cache cleared!',
      icon: 'success',
      showRefreshButton: true
    });
    closeClearCacheDialog();
  };

  const getCacheSize = () => {
    const size = memorySizeOf(cache);
    //console.log(size);
    return size;
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

  const openMoveChannelToPositionDialog = (channelIndex: number) => {
    closeMenu();
    setMoveToPositionChannelIndex(channelIndex);
  };

  const closeMoveChannelToPositionDialog = () => {
    setMoveToPositionChannelIndex(-1);
  };

  const moveChannelToPosition = (position: number) => {
    const indexTo = position - 1;
    if (indexTo !== moveToPositionChannelIndex) {
      moveChannel(moveToPositionChannelIndex, indexTo);
    }
    closeMoveChannelToPositionDialog();
  };

  const validateChannels = (channelsList: Channel[]): boolean => {
    let isValid = true;
    channelsList.forEach((channel: Channel) => {
      if (!channel.id || !channel.title || !channel.thumbnail || !channel.description || !channel.url) {
        //return false; // not working in foreach loop @see https://medium.com/front-end-weekly/3-things-you-didnt-know-about-the-foreach-loop-in-js-ff02cec465b1
        isValid = false;
      }
    });
    return isValid;
  };

  const clearCache = () => {
    closeMenu();
    setOpenClearCacheDialog(true);
  };

  const refreshRecentVideos = (event: any) => {
    closeMenu();
    onRefresh(ChannelSelection.RecentVideos, event);
  };

  const clearRecentVideos = () => {
    closeMenu();
    setOpenClearRecentVideosDialog(true);
  };

  const confirmClearRecentVideos = () => {
    onClearRecentVideos();
    closeClearRecentVideosDialog();
  };

  const closeClearRecentVideosDialog = () => {
    setOpenClearRecentVideosDialog(false);
  };

  const addRecentVideosToWatchLater = () => {
    closeMenu();
    onAddVideosToWatchLater();
  };

  const refreshAll = (event?: any) => {
    onRefresh(ChannelSelection.All, event);
  };

  const refreshTodaysVideos = (event: any) => {
    //closeMenu(); // no need to
    onRefresh(ChannelSelection.TodaysVideos, event);
  };

  const clearWatchLaterVideos = () => {
    setOpenClearWatchLaterVideosDialog(true);
  };

  const confirmClearWatchLaterVideos = () => {
    onClearWatchLaterVideos();
    closeClearWatchLaterVideosDialog();
  };

  const closeClearWatchLaterVideosDialog = () => {
    setOpenClearWatchLaterVideosDialog(false);
  };

  return (
    <div className={className || ''}>
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
                  <MenuItem onClick={() => exportChannels()}><GetAppIcon className={classes.menuIcon} />Export</MenuItem>
                  <MenuItem onClick={() => importChannels()}><ImportExportIcon className={classes.menuIcon} />Import</MenuItem>
                  <Tooltip title={"Cache size: " + getCacheSize()} aria-label="clear-cache">
                    <MenuItem onClick={() => clearCache()}><DeleteSweepIcon className={classes.menuIcon} />Clear cache</MenuItem>
                  </Tooltip>
                </Menu>
              </ListSubheader>}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              <ListItem button key="all" selected={selectedIndex === ChannelSelection.All} onClick={() => onShowAll()}>
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
                    <IconButton edge="end" aria-label="refresh" size="small" onClick={(event) => refreshAll(event)}>
                      <RefreshIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>}
              </ListItem>
              <ListItem button key="today" selected={selectedIndex === ChannelSelection.TodaysVideos} onClick={() => onShowTodaysVideos()}>
                <ListItemIcon>
                  <Badge color="secondary" badgeContent={todaysVideosCount}>
                    <Avatar>
                      <TodayIcon />
                    </Avatar>
                  </Badge>
                </ListItemIcon>
                <ListItemText primary="Today's videos" />
                {channels?.length > 0 && <ListItemSecondaryAction>
                  <Tooltip title="Refresh" aria-label="refresh">
                    <IconButton edge="end" aria-label="refresh" size="small" onClick={(event) => refreshTodaysVideos(event)}>
                      <RefreshIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>}
              </ListItem>
              <ListItem button key="recent" selected={selectedIndex === ChannelSelection.RecentVideos} onClick={() => onShowRecentVideos()}>
                <ListItemIcon>
                  <Badge color="secondary" badgeContent={recentVideosCount}>
                    <Avatar>
                      <NotificationsNoneIcon />
                    </Avatar>
                  </Badge>
                </ListItemIcon>
                <ListItemText primary="Recent videos" />
                {channels?.length > 0 && <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="more" size="small" onClick={(event) => openMenu(event, ChannelSelection.RecentVideos)}>
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                  <Menu
                    id="menu-recent-videos"
                    anchorEl={anchorEl}
                    keepMounted
                    open={openedMenuIndex === ChannelSelection.RecentVideos}
                    onClose={closeMenu}
                  >
                    <MenuItem onClick={(event) => refreshRecentVideos(event)}><RefreshIcon className={classes.menuIcon} /> Refresh</MenuItem>
                    {recentVideosCount > 0 && selectedIndex === ChannelSelection.RecentVideos && <MenuItem onClick={() => addRecentVideosToWatchLater()}><AccessTimeIcon className={classes.menuIcon} /> Add all to watch later list</MenuItem>}
                    {recentVideosCount > 0 && <MenuItem onClick={() => clearRecentVideos()}><DeleteIcon className={classes.menuIcon} /> Clear</MenuItem>}
                  </Menu>
                </ListItemSecondaryAction>}
              </ListItem>
              <ListItem button key="watchLater" selected={selectedIndex === ChannelSelection.WatchLaterVideos} onClick={() => onShowWatchLaterVideos()}>
                <ListItemIcon>
                  <Badge color="secondary" badgeContent={watchLaterVideosCount}>
                    <Avatar>
                      <AccessTimeIcon />
                    </Avatar>
                  </Badge>
                </ListItemIcon>
                <ListItemText primary="Watch later" />
                {watchLaterVideosCount > 0 && <ListItemSecondaryAction>
                  <Tooltip title="Clear" aria-label="clear">
                    <IconButton edge="end" aria-label="clear" size="small" onClick={() => clearWatchLaterVideos()}>
                      <DeleteIcon fontSize="small" />
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
                      channel.isHidden,
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
                        <MenuItem onClick={() => openChannel(channel)}><OpenInNewIcon className={classes.menuIcon} /> Open channel</MenuItem>
                        <MenuItem onClick={() => refreshChannel(channel, index)}><RefreshIcon className={classes.menuIcon} /> Refresh</MenuItem>
                        {isWebExtension() && isFirefox() && index > 0 && <MenuItem onClick={() => moveChannel(index, index - 1)}><KeyboardArrowUpIcon className={classes.menuIcon} />Move up</MenuItem>}
                        {isWebExtension() && isFirefox() && index < channels.length - 1 && <MenuItem onClick={() => moveChannel(index, index + 1)}><KeyboardArrowDownIcon className={classes.menuIcon} />Move down</MenuItem>}
                        {isWebExtension() && isFirefox() && <MenuItem onClick={() => openMoveChannelToPositionDialog(index)}><ControlCameraIcon className={classes.menuIcon} />Move to position</MenuItem>}
                        {channel.isHidden ? 
                          <MenuItem onClick={() => unhideChannel(channel, index)}><VisibilityIcon className={classes.menuIcon} /> Unhide</MenuItem> : 
                          <MenuItem onClick={() => hideChannel(channel, index)}><VisibilityOffIcon className={classes.menuIcon} /> Hide</MenuItem>
                        }
                        {isWebExtension() && (channel.notificationsDisabled ? 
                          <MenuItem onClick={() => enableChannelNotifications(channel, index)}><NotificationsActiveIcon className={classes.menuIcon} /> Enable notifications</MenuItem> : 
                          <MenuItem onClick={() => disableChannelNotifications(channel, index)}><NotificationsOffIcon className={classes.menuIcon} /> Disable notifications</MenuItem>
                        )}
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
        open={openClearRecentVideosDialog}
        title="Clear recent videos"
        description="Would you like to reset/clear recent videos?"
        confirmButtonText="Clear"
        onClose={closeClearRecentVideosDialog}
        onConfirm={confirmClearRecentVideos}
      />
      <ConfirmationDialog
        open={openClearWatchLaterVideosDialog}
        title="Clear watch later videos"
        description="Would you like to reset/clear watch later videos?"
        confirmButtonText="Clear"
        onClose={closeClearWatchLaterVideosDialog}
        onConfirm={confirmClearWatchLaterVideos}
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
        onValidate={validateChannels}
      />
      <MoveToPositionDialog
        open={moveToPositionChannelIndex > -1}
        title="Move Channel To Position"
        min={1}
        max={channels.length}
        positionFieldId="channel-position"
        positionFieldLabel="Position"
        onClose={closeMoveChannelToPositionDialog}
        onConfirm={moveChannelToPosition}
      />
    </div>
  )
}

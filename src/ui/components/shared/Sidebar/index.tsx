import React from 'react';
import List from '@material-ui/core/List';
import ExploreIcon from '@material-ui/icons/Explore';
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';
import SettingsIcon from '@material-ui/icons/Settings';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ListItemLink from './common/ListItemLink';
import Credit from './common/Credit';
import Logo from './common/Logo';
import useStyles from './styles';

interface SidebarProps {}

export function Sidebar(props: SidebarProps) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.body}>
        <div className={classes.title}>
          <Logo showVersion />
        </div>
        <div className={classes.list}>
          <List component="nav" aria-label="main">
            <ListItemLink icon={<ExploreIcon />} text="Home" to="/" />
            <ListItemLink icon={<SubscriptionsIcon />} text="Channels" to="/channels" badge={2} />
            <ListItemLink icon={<SettingsIcon />} text="Settings" to="/settings" />
            <ListItemLink icon={<InfoOutlinedIcon />} text="About" to="/about" />
          </List>
        </div>
      </div>
      <div className={classes.footer}>
        <Credit author="AXeL" repositoryUrl="https://github.com/AXeL-dev/youtube-viewer" />
      </div>
    </div>
  );
}

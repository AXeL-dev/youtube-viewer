import React from 'react';
import { Link, LinkProps, useLocation } from 'react-router-dom';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from './ListItem';
import Badge from './Badge';

interface ListItemLinkProps {
  icon: React.ReactElement;
  text: string;
  badge?: React.ReactNode;
  to: string;
}

function ListItemLink(props: ListItemLinkProps) {
  const { icon, text, badge, to } = props;
  const location = useLocation();
  const isSelected = location.pathname === to;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef<any, Omit<LinkProps, 'to'>>((itemProps, ref) => (
        <Link to={to} ref={ref} {...itemProps} />
      )),
    [to],
  );

  return (
    <ListItem button component={renderLink} selected={isSelected}>
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <ListItemText
        primary={
          <>
            {text}
            {badge && isSelected && <Badge color="secondary" badgeContent={badge} />}
          </>
        }
      />
    </ListItem>
  );
}

export default ListItemLink;

import React from 'react';
import { Link, LinkProps, useLocation } from 'react-router-dom';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItem from './ListItem';
import ListItemText from './ListItemText';
import Badge from './Badge';

interface ListItemLinkProps {
  icon: React.ReactElement;
  text: string;
  badge?: React.ReactNode;
  to: string;
}

export default function ListItemLink(props: ListItemLinkProps) {
  const { icon, text, badge, to } = props;
  const location = useLocation();
  const selected = location.pathname === to;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, Omit<LinkProps, 'to'>>(
        (itemProps, ref) => <Link to={to} ref={ref} {...itemProps} />
      ),
    [to]
  );

  return (
    <ListItem component={renderLink} selected={selected} disableRipple>
      {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
      <ListItemText
        primary={
          <>
            {text}
            {badge && selected ? <Badge badgeContent={badge} /> : null}
          </>
        }
      />
    </ListItem>
  );
}

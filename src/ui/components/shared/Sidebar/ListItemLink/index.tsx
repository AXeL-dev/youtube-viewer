import React from 'react';
import { Box } from '@mui/material';
import { Link, LinkProps, useLocation } from 'react-router-dom';
import ListItemIcon from '@mui/material/ListItemIcon';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ListItem from './ListItem';
import ListItemText from './ListItemText';
import Badge from './Badge';

interface ListItemLinkProps {
  icon: React.ReactElement;
  text: string;
  badge?: React.ReactNode;
  actions?: (selected: boolean) => React.ReactNode;
  hasWarning?: boolean;
  to: string;
}

export default function ListItemLink(props: ListItemLinkProps) {
  const { icon, text, badge, actions, hasWarning, to } = props;
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
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'space-between',
              marginRight: (theme) => theme.spacing(3),
            }}
          >
            {text}
            {badge && selected ? <Badge badgeContent={badge} /> : null}
            {actions && actions(selected)}
            {hasWarning && !selected ? (
              <ErrorOutlineIcon sx={{ ml: 3 }} color="warning" />
            ) : null}
          </Box>
        }
      />
    </ListItem>
  );
}

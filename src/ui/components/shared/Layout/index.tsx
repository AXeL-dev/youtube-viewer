import React from 'react';
import { Sidebar } from 'ui/components/shared';
import useStyles from './styles';

interface LayoutProps {
  children?: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Sidebar />
      <div className={classes.content}>
        {children}
      </div>
    </div>
  );
}

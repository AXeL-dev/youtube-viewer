import React from 'react';

export const childrenWithProps = (children: React.ReactNode, props: object) =>
  React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, props);
    }
    return child;
  });

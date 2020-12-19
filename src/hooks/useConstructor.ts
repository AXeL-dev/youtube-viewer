import React from 'react';

// Stolen from: https://dev.to/jz222/comment/ndbf
export const useConstructor = (callBack = () => {}) => {
  const hasBeenCalled = React.useRef(false);
  if (hasBeenCalled.current) return;
  callBack();
  hasBeenCalled.current = true;
};

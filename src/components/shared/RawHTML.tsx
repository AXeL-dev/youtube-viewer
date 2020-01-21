import React from 'react';

// Stolen from: https://stackoverflow.com/a/45810395
export const RawHTML = ({children, className = ''}: any): any =>
  <span className={className} dangerouslySetInnerHTML={{ __html: children.replace(/\n/g, '<br />')}} />

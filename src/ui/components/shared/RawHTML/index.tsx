import React from 'react';

interface RawHTMLProps {
  children: string;
  tag?: string;
  nl2br?: boolean;
}

export const RawHTML = ({
  children,
  tag = 'span',
  nl2br = true,
  ...rest
}: RawHTMLProps) =>
  React.createElement(tag, {
    dangerouslySetInnerHTML: {
      __html: nl2br ? children && children.replace(/\n/g, '<br />') : children,
    },
    ...rest,
  });

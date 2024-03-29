import React from 'react';
import { Link, Tooltip } from '@mui/material';
interface SocialLinkProps {
  children: React.ReactNode;
  tooltip: string;
  href: string;
  target?: '_blank' | '_self';
}

export default function SocialLink(props: SocialLinkProps) {
  const { children, tooltip, href, target = '_blank' } = props;

  return (
    <Tooltip title={tooltip} placement="bottom" arrow>
      <Link href={href} target={target} color="inherit" rel="noopener">
        {children}
      </Link>
    </Tooltip>
  );
}

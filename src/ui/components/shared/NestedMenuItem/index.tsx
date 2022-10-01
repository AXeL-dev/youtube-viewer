import React, { useState, useRef, useImperativeHandle } from 'react';
import { MenuProps } from '@mui/material/Menu';
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem';
import { StyledMenu } from '../StyledMenu';

export interface NestedMenuItemProps
  extends Omit<MenuItemProps, 'button' | 'ref'> {
  parentMenuOpen: boolean;
  component?: React.ElementType;
  label?: React.ReactNode;
  ContainerProps?: React.HTMLAttributes<HTMLElement> &
    React.RefAttributes<HTMLElement | null>;
  MenuProps?: Partial<Omit<MenuProps, 'children'>>;
  button?: true | undefined;
  isFirstItem?: boolean;
}

export interface NestedMenuItemRef {
  closeMenu: () => void;
}

export const NestedMenuItem = React.forwardRef<
  NestedMenuItemRef,
  NestedMenuItemProps
>((props, ref) => {
  const {
    parentMenuOpen,
    label,
    children,
    className,
    disabled,
    tabIndex: tabIndexProp,
    ContainerProps: ContainerPropsProp = {},
    MenuProps,
    isFirstItem,
    ...MenuItemProps
  } = props;

  const { ref: containerRefProp, ...ContainerProps } = ContainerPropsProp;
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const menuItemRef = useRef<HTMLLIElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      closeMenu: handleClose,
    }),
    [],
  );

  useImperativeHandle(containerRefProp, () => containerRef.current);

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    setIsSubMenuOpen(true);

    if (ContainerProps.onMouseEnter) {
      ContainerProps.onMouseEnter(e);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    setIsSubMenuOpen(false);

    if (ContainerProps.onMouseLeave) {
      ContainerProps.onMouseLeave(e);
    }
  };

  // Check if any immediate children are active
  const isSubmenuFocused = () => {
    const active = containerRef.current?.ownerDocument?.activeElement;
    const childrens = Array.from(menuContainerRef.current?.children ?? []);
    for (const child of childrens) {
      if (child === active) {
        return true;
      }
    }
    return false;
  };

  const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
    if (e.target === containerRef.current) {
      setIsSubMenuOpen(true);
    }

    if (ContainerProps.onFocus) {
      ContainerProps.onFocus(e);
    }
  };

  const handleClose = () => {
    setIsSubMenuOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      return;
    }

    if (isSubmenuFocused()) {
      e.stopPropagation();
    }

    const active = containerRef.current?.ownerDocument?.activeElement;

    if (e.key === 'ArrowLeft' && isSubmenuFocused()) {
      containerRef.current?.focus();
    }

    if (
      e.key === 'ArrowRight' &&
      e.target === containerRef.current &&
      e.target === active
    ) {
      const firstChild = menuContainerRef.current?.children[0] as
        | HTMLElement
        | undefined;
      firstChild?.focus();
    }
  };

  const open = isSubMenuOpen && parentMenuOpen;

  // Root element must have a `tabIndex` attribute for keyboard navigation
  let tabIndex;
  if (!disabled) {
    tabIndex = tabIndexProp !== undefined ? tabIndexProp : -1;
  }

  return (
    <div
      {...ContainerProps}
      ref={containerRef}
      onFocus={handleFocus}
      tabIndex={tabIndex}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
    >
      <MenuItem {...MenuItemProps} className={className} ref={menuItemRef}>
        {label}
      </MenuItem>
      <StyledMenu
        anchorEl={menuItemRef.current}
        open={open}
        autoFocus={false}
        disableAutoFocus
        disableEnforceFocus
        onClose={handleClose}
        {...MenuProps}
        // Set pointer events to 'none' to prevent the invisible Popover div
        // from capturing events for clicks and hovers
        style={{
          pointerEvents: 'none',
          marginTop: isFirstItem ? -1 : 0,
          marginLeft: -1,
          ...MenuProps?.style,
        }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <div ref={menuContainerRef} style={{ pointerEvents: 'auto' }}>
          {children}
        </div>
      </StyledMenu>
    </div>
  );
});

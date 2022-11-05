/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, FC, memo, useContext, useMemo, useState } from 'react';
import { useAppSelector } from 'store';
import { selectViewChannelOption } from 'store/selectors/settings';
import { HomeView } from 'types';

type ChannelOptionsContextType = {
  collapseByDefault: boolean;
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
};

const ChannelOptionsContext = createContext<
  ChannelOptionsContextType | undefined
>(undefined);

export const ChannelOptionsProvider: FC<{ view: HomeView }> = memo(
  ({ view, children }) => {
    const collapseByDefault = useAppSelector(
      selectViewChannelOption(view, 'collapseByDefault'),
    );
    const [collapsed, setCollapsed] = useState(collapseByDefault);

    const value = useMemo(
      () => ({
        collapseByDefault,
        collapsed: collapseByDefault && collapsed,
        setCollapsed,
      }),
      [collapseByDefault, collapsed],
    );

    return (
      <ChannelOptionsContext.Provider value={value}>
        {children}
      </ChannelOptionsContext.Provider>
    );
  },
);

export function useChannelOptions(): ChannelOptionsContextType {
  const context = useContext(ChannelOptionsContext);

  if (context === undefined) {
    throw new Error(
      'useChannelOptions must be used within a ChannelOptionsContext',
    );
  }

  return context;
}

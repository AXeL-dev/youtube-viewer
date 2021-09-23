import { useWidth } from './useWidth';

interface GridColumns {
  [key: string]: number;
}

export function useGrid(columns: GridColumns) {
  const width = useWidth();

  return {
    itemsPerRow: columns[width],
  };
}

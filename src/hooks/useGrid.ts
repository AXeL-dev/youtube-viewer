import { useWidth } from './useWidth';

interface GridColumns {
  [key: string]: number;
}

export function useGrid(columns: GridColumns) {
  const width = useWidth('xl');

  return {
    itemsPerRow: columns[width],
  };
}

import { EqualityFn } from 'react-redux';

export const jsonEqualityFn: EqualityFn<any> = (left, right) =>
  JSON.stringify(left) === JSON.stringify(right);

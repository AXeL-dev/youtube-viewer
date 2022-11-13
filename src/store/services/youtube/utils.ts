import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { FetchError } from 'types';

export const isFetchTimeoutError = (err: FetchBaseQueryError | undefined) =>
  err && err.status === 'FETCH_ERROR' && err.error === FetchError.TIMEOUT;

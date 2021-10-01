import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from 'store';

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://www.googleapis.com/youtube/v3/',
  prepareHeaders: (headers, { getState }) => {
    const apiKey = (getState() as RootState).settings.apiKey;
    if (apiKey) {
      headers.set('X-Goog-Api-Key', apiKey);
    }
    return headers;
  },
});

export const youtubeApi = createApi({
  reducerPath: 'youtubeApi',
  baseQuery,
  endpoints: () => ({}),
});

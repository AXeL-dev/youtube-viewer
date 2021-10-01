import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  loaded: boolean;
}

const initialState: AppState = {
  loaded: false,
};

export const appSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setApp: (state, action: PayloadAction<Partial<AppState>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { setApp } = appSlice.actions;

export default appSlice.reducer;

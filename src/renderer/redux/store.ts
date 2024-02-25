import { configureStore } from '@reduxjs/toolkit';
import { reducer } from './slices';

export type State = ReturnType<typeof reducer>;

const store = configureStore({
  reducer,
});

export default store;

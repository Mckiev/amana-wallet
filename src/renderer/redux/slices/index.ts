import { combineReducers } from '@reduxjs/toolkit';
import account from './account';
import logs from './logs';
import positions from './positions';

export const reducer = combineReducers({
  account,
  logs,
  positions,
});

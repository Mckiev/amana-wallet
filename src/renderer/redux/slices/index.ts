import { combineReducers } from '@reduxjs/toolkit';
import account from './account';
import logs from './logs';
import positions from './positions';
import withdrawal from './withdrawal';
import bet from './bet';

export const reducer = combineReducers({
  account,
  logs,
  positions,
  withdrawal,
  bet,
});

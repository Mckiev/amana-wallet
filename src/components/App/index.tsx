import type { FunctionComponent } from 'react';
import React from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import Title from '../Title';
import Deposit from '../Deposit';
import Withdraw from '../Withdraw';
import Bet from '../Bet';
import Positions from '../Positions';
import Logs from '../Logs';
import store from '../../redux/store';
import LoginModal from '../LoginModal';
import styles from './index.scss';

const Overview: FunctionComponent = () => (
  <Provider store={store}>
    <div className={styles.app}>
      <LoginModal />
      <ToastContainer />
      <Title />
      <div className={styles.layoutContainer}>
        <Deposit />
        <Withdraw />
        <Bet />
        <Positions />
        <Logs />
      </div>
    </div>
  </Provider>
);

export default Overview;

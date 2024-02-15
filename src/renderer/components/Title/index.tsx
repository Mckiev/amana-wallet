import type { FunctionComponent } from 'react';
import React from 'react';
import styles from './index.scss';
import CopyableAddress from '../CopyableAddress';
import { useSelector } from 'react-redux';
import { getBalance } from '../../redux/selectors';

const Title: FunctionComponent = () => {
  const balance = useSelector(getBalance);
  return (
    <div className={styles.title}>
      <h1>AMANA Wallet</h1>
      <h2><CopyableAddress /></h2>
      <h2>Balance: {balance.toString()}</h2>
    </div>
  );
}

export default Title;

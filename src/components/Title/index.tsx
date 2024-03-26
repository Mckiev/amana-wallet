import type { FunctionComponent } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import CopyableText from '../CopyableText';
import { getBalance, getPrimaryAddress, getShortPrimaryAddress } from '../../redux/selectors';
import styles from './index.scss';

const Title: FunctionComponent = () => {
  const balance = useSelector(getBalance);
  const primaryAddress = useSelector(getPrimaryAddress) ?? '';
  const shortAddress = useSelector(getShortPrimaryAddress) ?? '0zk...';

  return (
    <div className={styles.title}>
      <h1>AMANA Wallet</h1>
      <h2><CopyableText copyText={primaryAddress} displayText={shortAddress} toastText='Primary Address copied to clipboard'  /></h2>
      <h2>
        Balance:
        {balance.toString()}
      </h2>
    </div>
  );
};

export default Title;

import type { FunctionComponent } from 'react';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CopyableText from '../CopyableText';
import { getBalance, getBalanceRefreshing, getPrimaryAddress, getShortPrimaryAddress } from '../../redux/selectors';
import railgun from '../../railgun';
import { AccountActions } from '../../redux/slices/account';
import styles from './index.scss';

const Title: FunctionComponent = () => {
  const dispatch = useDispatch();
  const balance = useSelector(getBalance);
  const refreshing = useSelector(getBalanceRefreshing);
  const primaryAddress = useSelector(getPrimaryAddress) ?? '';
  const shortAddress = useSelector(getShortPrimaryAddress) ?? '0zk...';
  const refresh = useCallback(async() => {
    dispatch(AccountActions.refreshBalance());
    await railgun.refreshBalance();
  }, [dispatch]);
  return (
    <div className={styles.title}>
      <h1>AMANA Wallet</h1>
      <h2><CopyableText copyText={primaryAddress} displayText={shortAddress} toastText="Primary Address copied to clipboard" /></h2>
      <h2>
        Balance:
        {' '}
        {balance.toString()}
        <button className={styles.balanceRefresh} onClick={refresh} type="button" disabled={refreshing}>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </h2>
    </div>
  );
};

export default Title;

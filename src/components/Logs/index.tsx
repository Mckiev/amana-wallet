import type { FunctionComponent } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import Panel from '../Panel';
import { getTransactions } from '../../redux/selectors';
import { TransactionType } from '../../types';
import styles from './index.scss';

const Logs: FunctionComponent = () => {
  const transactions = useSelector(getTransactions);
  return (
    <Panel>
      <h2>Logs</h2>
      {transactions.map((log) => {
        const date = new Date(log.timestamp);
        const dateTimeString = date.toLocaleString();
        const logText = log.type === TransactionType.Incoming
          ? `[${dateTimeString}] Incoming: +${log.amount} AMANA (memo: ${log.memoText})`
          : `[${dateTimeString}] Outgoing: -${log.amount} AMANA (memo: ${log.memoText})`;
        return (
          <div className={styles.log} key={log.txid}>{logText}</div>
        );
      })}
    </Panel>
  );
};

export default Logs;

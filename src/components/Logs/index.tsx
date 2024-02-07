import type { FunctionComponent } from 'react';
import React from 'react';
import Panel from '../Panel';
import styles from './index.scss';
import { useSelector } from 'react-redux';
import { getLogs } from '../../redux/selectors';

const Logs: FunctionComponent = () => {
  const logs = useSelector(getLogs);
  return (
    <Panel>
      <h2>Logs</h2>
      {logs.map(log => (
        <div className={styles.log}>{log}</div>
      ))}
    </Panel>
  );
};

export default Logs;

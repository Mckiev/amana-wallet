import type { FunctionComponent } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import Panel from '../Panel';
import { getLogs } from '../../redux/selectors';
import styles from './index.scss';

const Logs: FunctionComponent = () => {
  const logs = useSelector(getLogs);
  return (
    <Panel>
      <h2>Logs</h2>
      {logs.map(log => (
        <div className={styles.log} key={log}>{log}</div>
      ))}
    </Panel>
  );
};

export default Logs;

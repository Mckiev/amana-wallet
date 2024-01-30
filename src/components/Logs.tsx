import React, { FunctionComponent } from 'react';

type Props = {
  logs: string[];
};

const Logs: FunctionComponent<Props> = ({ logs }) => {
  return (
    <div>
      <h2>Logs</h2>
      {logs.map(log => (
        <p>{log}</p>
      ))}
    </div>
  );
};

export default Logs;
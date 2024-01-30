import React, { FunctionComponent, useCallback, useState } from 'react';
import { Prediction } from './Bet';

export type Position = {
  url: string;
  prediction: Prediction
  shares: number;
};

type Props = {
  positions: Position[];
};

const Positions: FunctionComponent<Props> = ({ positions }) => {
  const onClose = useCallback(() => {
    // TODO: close position
  }, []);
  return (
    <div>
      <h2>Positions</h2>
      {positions.map((position) => (
        <div>
          <p>URL: {position.url}</p>
          <p>Prediction: {position.prediction}</p>
          <p>Shares: {position.shares}</p>
          <button type="button" onClick={onClose}>Close</button>
        </div>
      ))}
    </div>
  );
};

export default Positions;
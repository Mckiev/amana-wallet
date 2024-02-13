import React, { FunctionComponent } from 'react';
import { Position } from '../../types';
import styles from './index.scss';

type Props = {
  position: Position;
}

const PositionDisplay: FunctionComponent<Props> = ({ position }) => {
  return (
    <div className={styles.positionDisplay}>
      <div className={styles.value}>
        URL:
        {' '}
        <a href={position.url} target="_blank">{position.url}</a>
      </div>
      <div className={styles.value}>
        Prediction:
        {' '}
        {position.prediction}
      </div>
      <div className={styles.value}>
        Shares:
        {' '}
        {position.shares}
      </div>
      <div className={styles.value}>
        Status:
        {' '}
        {position.status}
      </div>
      <button type="button">Close</button>
    </div>
  );
};

export default PositionDisplay;
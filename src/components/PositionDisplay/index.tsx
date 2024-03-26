import type { FunctionComponent } from 'react';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { BetState, type Position } from '../../types';
import { PositionsActions } from '../../redux/slices/positions';
import styles from './index.scss';
import CopyableText from '../CopyableText';

type Props = {
  position: Position;
};

const PositionDisplay: FunctionComponent<Props> = ({ position }) => {
  const dispatch = useDispatch();
  const onClick = useCallback(() => {
    dispatch(PositionsActions.beginRedeeming(position.id));
  }, [dispatch, position.id]);
  return (
    <div className={styles.positionDisplay}>
      <div className={styles.value}>
        URL:
        {' '}
        <CopyableText copyText={position.url} displayText={position.url} toastText="URL copied to clipboard" />
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
        Total purchase price:
        {' '}
        {position.purchasePrice}
        {' '}
        AMANA
      </div>
      <div className={styles.value}>
        Status:
        {' '}
        {position.state}
      </div>
      <div className={styles.value}>
        Timestamp:
        {' '}
        {(new Date(position.timestamp)).toLocaleString()}
      </div>
      {
        position.state === BetState.Placed
          ? <button type="button" onClick={onClick}>Close Position</button>
          : null
      }
    </div>
  );
};

export default PositionDisplay;

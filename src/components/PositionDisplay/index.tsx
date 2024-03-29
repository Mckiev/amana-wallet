import type { FunctionComponent } from 'react';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { BetState, type Position } from '../../types';
import { PositionsActions } from '../../redux/slices/positions';
import CopyableText from '../CopyableText';
import styles from './index.scss';

type Props = {
  position: Position;
};

const ToastMsg: FunctionComponent = () => (
  <div>
    <p>URL copied to clipboard</p>
    <p><b>We encourage opening in private mode (logged out of manifold)</b></p>
  </div>
);

const PositionDisplay: FunctionComponent<Props> = ({ position }) => {
  const dispatch = useDispatch();
  const onClick = useCallback(() => {
    dispatch(PositionsActions.beginRedeeming(position.id));
  }, [dispatch, position.id]);
  return (
    <div className={styles.positionDisplay}>
      <div className={styles.value}>
        <CopyableText
          copyText={position.url}
          displayText={position.url}
          toastText={<ToastMsg />}
        />
      </div>
      <div className={styles.value}>
        Prediction:
        {' '}
        <b>{position.prediction}</b>
      </div>
      <div className={styles.value}>
        Shares:
        {' '}
        <b>{position.shares}</b>
      </div>
      <div className={styles.value}>
        Total purchase price:
        {' '}
        <b>{position.purchasePrice}</b>
        {' '}
        AMANA
      </div>
      <div className={styles.value}>
        Status:
        {' '}
        <b>{position.state}</b>
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

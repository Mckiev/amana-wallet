import type { FunctionComponent } from 'react';
import React, { useCallback, useState } from 'react';
import classnames from 'classnames';
import Panel from '../Panel';
import { Prediction } from '../../types';
import styles from './index.scss';

enum BetStatus {
  None = 'None',
  Submitting = 'Submitting',
  Confirming = 'Confirming',
  Confirmed = 'Confirmed',
  Failed = 'Failed',
}

const Bet: FunctionComponent = () => {
  const [prediction, setPrediction] = useState(Prediction.Unselected);
  const [betStatus, setBetStatus] = useState(BetStatus.None);

  const onClickYes = useCallback(() => {
    setPrediction(Prediction.Yes);
  }, []);
  const onClickNo = useCallback(() => {
    setPrediction(Prediction.No);
  }, []);

  const onClick = useCallback(() => {
    if (betStatus === BetStatus.None) {
      setBetStatus(BetStatus.Failed);
    }
  }, [betStatus]);

  return (
    <Panel>
      <h2>Bet</h2>
      <label htmlFor="manifoldUrl">Manifold URL</label>
      <input type="text" name="manifoldUrl" />
      <p>
        Prediction:
        {' '}
        <span
          onClick={onClickYes}
          className={classnames(styles.prediction, {
            [styles.active]: prediction === Prediction.Yes,
          })}
        >
          Yes
        </span>
        <span
          onClick={onClickNo}
          className={classnames(styles.prediction, {
            [styles.active]: prediction === Prediction.No,
          })}
        >
          No
        </span>
      </p>
      <label htmlFor="betAmount">Bet amount: </label>
      <input type="number" name="betAmount" />
      <button type="button" onClick={onClick}>Place Bet</button>
      <p>
        Status:
        {betStatus}
      </p>
    </Panel>
  );
};

export default Bet;

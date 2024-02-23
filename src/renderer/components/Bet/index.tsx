import type { FunctionComponent } from 'react';
import React, { useCallback, useState } from 'react';
import classnames from 'classnames';
import Panel from '../Panel';
import { Prediction } from '../../types';
import styles from './index.scss';

enum Status {
  None = 'None',
  Submitting = 'Submitting',
  Confirming = 'Confirming',
  Confirmed = 'Confirmed',
  Error = 'Error',
}

const Bet: FunctionComponent = () => {
  const [prediction, setPrediction] = useState(Prediction.Unselected);
  const [status, setStatus] = useState(Status.None);

  const onClickYes = useCallback(() => {
    setPrediction(Prediction.Yes);
  }, []);
  const onClickNo = useCallback(() => {
    setPrediction(Prediction.No);
  }, []);

  const onClick = useCallback(() => {
    if (status === Status.None) {
      setStatus(Status.Error);
    }
  }, [status]);

  return (
    <Panel>
      <h2>Bet</h2>
      <label htmlFor="manifoldUrl">Manifold URL</label>
      <input type="text" name="manifoldUrl" />
      <p>
        Prediction:
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
        {status}
      </p>
    </Panel>
  );
};

export default Bet;

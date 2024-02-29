import type { ChangeEvent, FunctionComponent } from 'react';
import React, { useCallback } from 'react';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import Panel from '../Panel';
import { Prediction } from '../../types';
import { BetActions } from '../../redux/slices/bet';
import { getBetAmount, getBetMarketUrl, getBetPrediction, getBetStatus } from '../../redux/selectors';
import BetModal from '../BetModal';
import styles from './index.scss';

const Bet: FunctionComponent = () => {
  const dispatch = useDispatch();
  const betStatus = useSelector(getBetStatus);
  const amount = useSelector(getBetAmount);
  const marketUrl = useSelector(getBetMarketUrl);
  const prediction = useSelector(getBetPrediction);

  const onChangeBetAmount = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      dispatch(BetActions.updateAmount(e.target.value));
    },
    [dispatch],
  );

  const onChangeMarketUrl = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      dispatch(BetActions.updateMarketUrl(e.target.value));
    },
    [dispatch],
  );

  const onClickYes = useCallback(() => {
    dispatch(BetActions.updatePrediction(Prediction.Yes));
  }, [dispatch]);

  const onClickNo = useCallback(() => {
    dispatch(BetActions.updatePrediction(Prediction.No));
  }, [dispatch]);

  const onClick = useCallback(() => {
    dispatch(BetActions.beginBet());
  }, [dispatch]);

  return (
    <Panel>
      <h2>Bet</h2>
      <label htmlFor="manifoldUrl">Manifold URL</label>
      <input value={marketUrl} onChange={onChangeMarketUrl} type="text" name="manifoldUrl" />
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
      <input value={amount.toString()} onChange={onChangeBetAmount} type="number" name="betAmount" />
      <button type="button" onClick={onClick}>Place Bet</button>
      <p>
        Status:
        {betStatus}
      </p>
      <BetModal />
    </Panel>
  );
};

export default Bet;

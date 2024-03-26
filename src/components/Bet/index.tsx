import type { ChangeEvent, FunctionComponent } from 'react';
import React, { useCallback, useState } from 'react';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import Panel from '../Panel';
import { Prediction } from '../../types';
import { BetActions } from '../../redux/slices/bet';
import { getBetMarketUrl, getBetPrediction, getBetStatus } from '../../redux/selectors';
import BetModal from '../BetModal';
import styles from './index.scss';

const Bet: FunctionComponent = () => {
  const dispatch = useDispatch();
  const betStatus = useSelector(getBetStatus);
  const [amount, setAmount] = useState('0');
  const marketUrl = useSelector(getBetMarketUrl);
  const prediction = useSelector(getBetPrediction);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const onChangeBetAmount = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/ug, '');
      setAmount(value);
    },
    [setAmount],
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
    const isValidUrl = marketUrl.startsWith('https://');
    if (!isValidUrl) {
      setErrorMessage('Error: A valid market URL must be provided.');
      return;
    }
    const amountValue = Number.parseInt(amount, 10);
    const isValidAmount = Number.isSafeInteger(amountValue) && amountValue > 0;
    if (!isValidAmount) {
      setErrorMessage('Error: Amount must be a valid integer');
      return;
    }
    setErrorMessage(undefined);
    dispatch(BetActions.updateAmount(amount));
    dispatch(BetActions.beginBet());
  }, [dispatch, amount, marketUrl]);

  return (
    <Panel>
      <h2>Bet</h2>
      <p>Provide the URL of the BINARY market you want to bet on</p>
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
      <input min={1} step={1} value={amount} onChange={onChangeBetAmount} type="number" name="betAmount" />
      <button type="button" onClick={onClick}>Place Bet</button>
      <p className={styles.error}>
        {errorMessage}
      </p>
      <p>
        Status:
        {betStatus}
      </p>
      <BetModal />
    </Panel>
  );
};

export default Bet;

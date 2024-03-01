import type { ChangeEvent, FunctionComponent } from 'react';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Panel from '../Panel';
import { getWithdrawalManifoldUser } from '../../redux/selectors';
import { WithdrawalActions } from '../../redux/slices/withdrawal';
import WithdrawalModal from '../WithdrawalModal';
import styles from './index.scss';

const Withdraw: FunctionComponent = () => {
  const dispatch = useDispatch();
  const manifoldUser = useSelector(getWithdrawalManifoldUser);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [amount, setAmount] = useState('0');

  const onChangeManifoldUser = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      dispatch(WithdrawalActions.updateManifoldUser(e.target.value));
    },
    [dispatch],
  );

  const onChangeWithdrawalAmount = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/ug, '');
      setAmount(value);
    },
    [setAmount],
  );

  const onClick = useCallback(() => {
    if (manifoldUser.length === 0) {
      setErrorMessage('Error: A manifold username must be provided.');
      return;
    }
    const amountValue = Number.parseInt(amount, 10);
    const isValidAmount = Number.isSafeInteger(amountValue) && amountValue > 0;
    if (!isValidAmount) {
      setErrorMessage('Error: Amount must be a valid integer');
      return;
    }
    setErrorMessage(undefined);
    dispatch(WithdrawalActions.updateAmount(amount));
    dispatch(WithdrawalActions.beginWithdrawal());
  }, [dispatch, manifoldUser, amount]);

  return (
    <Panel>
      <h2>Withdraw</h2>
      <label htmlFor="manifoldUser">Manifold user: </label>
      <input
        type="text"
        name="manifoldUser"
        value={manifoldUser}
        onChange={onChangeManifoldUser}
      />
      <label htmlFor="withdrawalAmount">Withdrawal amount: </label>
      <input
        type="number"
        name="withdrawalAmount"
        value={amount}
        onChange={onChangeWithdrawalAmount}
      />
      <button type="button" onClick={onClick}>Withdraw</button>
      <p className={styles.error}>
        {errorMessage}
      </p>
      <WithdrawalModal />
    </Panel>
  );
};

export default Withdraw;

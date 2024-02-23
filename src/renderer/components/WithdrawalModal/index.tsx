import type { FunctionComponent } from 'react';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getWithdrawalAmount, getWithdrawalManifoldUser, getWithdrawalStatus } from '../../redux/selectors';
import { WithdrawalActions, WithdrawalStatus } from '../../redux/slices/withdrawal';
import styles from './index.scss';

const WithdrawalModal: FunctionComponent = () => {
  const dispatch = useDispatch();
  const withdrawalStatus = useSelector(getWithdrawalStatus);
  const manifoldUser = useSelector(getWithdrawalManifoldUser);
  const amount = useSelector(getWithdrawalAmount);
  const onConfirm = useCallback(() => {
    // TODO: send withdrawal to the main process, sign, and send to server
    dispatch(WithdrawalActions.confirmWithdrawal());
  }, [dispatch]);
  const onCancel = useCallback(() => {
    dispatch(WithdrawalActions.cancelWithdrawal());
  }, [dispatch]);
  if (withdrawalStatus === WithdrawalStatus.None) {
    return null;
  }
  const usernameLabel = `Manifold username: ${manifoldUser}`;
  const amountLabel = `Withdrawal amount: ${amount}`;
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h1>Withdrawal Confirmation</h1>
        <p>Would you like to submit the following withdrawal?</p>
        <p>{usernameLabel}</p>
        <p>{amountLabel}</p>
        <button type="button" onClick={onConfirm}>Confirm</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default WithdrawalModal;

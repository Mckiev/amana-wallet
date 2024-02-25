import type { FunctionComponent } from 'react';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getMnemonic, getWithdrawalAmount, getWithdrawalManifoldUser, getWithdrawalStatus } from '../../redux/selectors';
import { WithdrawalActions, WithdrawalStatus } from '../../redux/slices/withdrawal';
import ipcRequest from '../../IpcRequest';
import styles from './index.scss';

const WithdrawalModal: FunctionComponent = () => {
  const dispatch = useDispatch();
  const mnemonic = useSelector(getMnemonic);
  const withdrawalStatus = useSelector(getWithdrawalStatus);
  const manifoldUser = useSelector(getWithdrawalManifoldUser);
  const amount = useSelector(getWithdrawalAmount);
  const onConfirm = useCallback(() => {
    if (mnemonic === undefined) {
      toast('Withdrawal failed: missing mnemonic');
      return;
    }
    ipcRequest.withdraw(mnemonic, amount, manifoldUser)
      .catch((e) => {
        toast(`Withdrawal failed: ${e}`);
      });
    dispatch(WithdrawalActions.confirmWithdrawal());
    // TODO: Do not toast until the main process has
    // actually submitted the proof
    toast('Withdrawal submitted');
  }, [dispatch, mnemonic, amount, manifoldUser]);
  const onCancel = useCallback(() => {
    dispatch(WithdrawalActions.cancelWithdrawal());
  }, [dispatch]);
  if (withdrawalStatus === WithdrawalStatus.None) {
    return null;
  }
  const usernameLabel = `Manifold username: ${manifoldUser}`;
  const amountLabel = `Withdrawal amount: ${amount.toString()}`;
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

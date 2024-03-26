import type { FunctionComponent } from 'react';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getMnemonic, getWithdrawalAmount, getWithdrawalManifoldUser, getWithdrawalStatus, getEncryptionKey } from '../../redux/selectors';
import { WithdrawalActions, WithdrawalStatus } from '../../redux/slices/withdrawal';
import Modal from '../Modal';
import railgun from '../../railgun';

const WithdrawalModal: FunctionComponent = () => {
  const dispatch = useDispatch();
  const mnemonic = useSelector(getMnemonic);
  const encryptionKey = useSelector(getEncryptionKey);
  const withdrawalStatus = useSelector(getWithdrawalStatus);
  const manifoldUser = useSelector(getWithdrawalManifoldUser);
  const amount = useSelector(getWithdrawalAmount);
  const onConfirm = useCallback(() => {
    if (mnemonic === undefined) {
      toast('Withdrawal failed: missing mnemonic');
      return;
    }
    if (encryptionKey === undefined) {
      toast('Withdrawal failed: missing encryption key');
      return;
    }
    railgun.withdraw(mnemonic, encryptionKey, amount, manifoldUser)
      .catch((e) => {
        toast(`Withdrawal failed: ${e}`);
      });
    dispatch(WithdrawalActions.confirmWithdrawal());
    // TODO: Do not toast until the main process has
    // actually submitted the proof
    toast('Withdrawal submitted');
  }, [dispatch, mnemonic, encryptionKey, amount, manifoldUser]);
  const onCancel = useCallback(() => {
    dispatch(WithdrawalActions.cancelWithdrawal());
  }, [dispatch]);
  const usernameLabel = `Manifold username: ${manifoldUser}`;
  const amountLabel = `Withdrawal amount: ${amount.toString()}`;
  return (
    <Modal isOpen={withdrawalStatus !== WithdrawalStatus.None}>
      <h1>Withdrawal Confirmation</h1>
      <p>Would you like to submit the following withdrawal?</p>
      <p>{usernameLabel}</p>
      <p>{amountLabel}</p>
      <button type="button" onClick={onConfirm}>Confirm</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </Modal>
  );
};

export default WithdrawalModal;

import type { ChangeEvent, FunctionComponent } from 'react';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Panel from '../Panel';
import { getWithdrawalAmount, getWithdrawalManifoldUser } from '../../redux/selectors';
import { WithdrawalActions } from '../../redux/slices/withdrawal';
import WithdrawalModal from '../WithdrawalModal';

const Withdraw: FunctionComponent = () => {
  const dispatch = useDispatch();
  const manifoldUser = useSelector(getWithdrawalManifoldUser);
  const amount = useSelector(getWithdrawalAmount);

  const onChangeManifoldUser = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      dispatch(WithdrawalActions.updateManifoldUser(e.target.value));
    },
    [dispatch],
  );

  const onChangeWithdrawalAmount = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      dispatch(WithdrawalActions.updateAmount(e.target.value));
    },
    [dispatch],
  );

  const onClick = useCallback(() => {
    dispatch(WithdrawalActions.beginWithdrawal());
  }, [dispatch]);

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
        value={amount.toString()}
        onChange={onChangeWithdrawalAmount}
      />
      <button type="button" onClick={onClick}>Withdraw</button>
      <WithdrawalModal />
    </Panel>
  );
};

export default Withdraw;

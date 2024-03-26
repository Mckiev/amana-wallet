import type { FunctionComponent } from 'react';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getMnemonic, getRedeemingPosition, getEncryptionKey } from '../../redux/selectors';
import Modal from '../Modal';
import { PositionsActions } from '../../redux/slices/positions';
import railgun from '../../railgun';
import constants from '../../constants';

const redeem = async(
  mnemonic: string,
  encryptionKey: string,
  redemptionAddress: string,
): Promise<void> => {
  const signature = await railgun.signRedemption(
    mnemonic,
    encryptionKey,
    redemptionAddress,
  );
  const endpoint = `${constants.RELAYER_HOST}/redeem`;
  await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      redemptionAddress,
      signature,
    }),
  });
};

const RedemptionModal: FunctionComponent = () => {
  const dispatch = useDispatch();
  const mnemonic = useSelector(getMnemonic);
  const encryptionKey = useSelector(getEncryptionKey);
  const position = useSelector(getRedeemingPosition);
  const onConfirm = useCallback(() => {
    if (typeof mnemonic !== 'string') {
      return;
    }
    if (position === undefined) {
      return;
    }
    if (encryptionKey === undefined) {
      return;
    }
    redeem(mnemonic, encryptionKey, position.redemptionAddress)
      .catch((e) => {
        toast(`Redemption request failed: ${e}`);
      });
    toast('Redemption request submitted');
    dispatch(PositionsActions.completeRedeeming());
  }, [dispatch, mnemonic, encryptionKey, position]);
  const onCancel = useCallback(() => {
    dispatch(PositionsActions.cancelRedeeming());
  }, [dispatch]);
  const urlLabel = `URL: ${position?.url}`;
  const predictionLabel = `Prediction: ${position?.prediction}`;
  const sharesLabel = `Shares: ${position?.shares}`;
  const priceLabel = `Total purchase price: ${position?.purchasePrice} AMANA`;
  const timestampLabel = `Timestamp: ${(new Date(position?.timestamp ?? 0)).toLocaleString()}`;
  return (
    <Modal isOpen={position !== undefined}>
      <h1>Close Position Confirmation</h1>
      <p>Would you like to sell all shares for this position on the market?</p>
      <p>{urlLabel}</p>
      <p>{predictionLabel}</p>
      <p>{sharesLabel}</p>
      <p>{priceLabel}</p>
      <p>{timestampLabel}</p>
      <button type="button" onClick={onConfirm}>Confirm</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </Modal>
  );
};

export default RedemptionModal;

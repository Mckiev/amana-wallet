import type { FunctionComponent } from 'react';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getBetAmount, getBetMarketUrl, getBetPrediction, getBetStatus, getMnemonic, getEncryptionKey } from '../../redux/selectors';
import { BetActions, BetStatus } from '../../redux/slices/bet';
import Modal from '../Modal';
import styles from './index.scss';

const BetModal: FunctionComponent = () => {
  const dispatch = useDispatch();
  const mnemonic = useSelector(getMnemonic);
  const encryptionKey = useSelector(getEncryptionKey);
  const betStatus = useSelector(getBetStatus);
  const amount = useSelector(getBetAmount);
  const marketUrl = useSelector(getBetMarketUrl);
  const prediction = useSelector(getBetPrediction);
  const onConfirm = useCallback(() => {
    if (mnemonic === undefined) {
      toast('Bet failed: missing mnemonic');
      return;
    }
    if (encryptionKey === undefined) {
      toast('Bet failed: missing encryption key');
      return;
    }
    // TODO:
    // ipcRequest.bet(mnemonic, encryptionKey, amount, marketUrl, prediction)
    // .catch((e) => {
    //   toast(`Bet failed: ${e}`);
    // });
    dispatch(BetActions.confirmBet());
    // TODO: Do not toast until the main process has
    // actually submitted the proof
    toast('Bet submitted');
  }, [dispatch, mnemonic, encryptionKey, amount, marketUrl, prediction]);
  const onCancel = useCallback(() => {
    dispatch(BetActions.cancelBet());
  }, [dispatch]);
  const amountLabel = `Bet amount: ${amount.toString()}`;
  const marketUrlLabel = `Manifold URL: ${marketUrl}`;
  const predictionLabel = `Prediction: ${prediction}`;
  return (
    <Modal isOpen={betStatus !== BetStatus.None}>
      <div className={styles.betModal}>
        <h1>Bet Confirmation</h1>
        <p>Would you like to submit the following bet?</p>
        <p>{amountLabel}</p>
        <p>{marketUrlLabel}</p>
        <p>{predictionLabel}</p>
        <button type="button" onClick={onConfirm}>Confirm</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </Modal>
  );
};

export default BetModal;

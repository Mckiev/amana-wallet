import type { FunctionComponent } from 'react';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { AccountActions } from '../../redux/slices/account';
import IpcRequest from '../../IpcRequest';
import { getMnemonic } from '../../redux/selectors';
import styles from './index.scss';

const notice = 'Your seed phrase above is used to access your new wallet. Please save it somewhere safe. If you lose it, there is no way to recover your mana.';
const warning = 'Only proceed if you have securely stored your seed phrase.';

const ConfirmWallet: FunctionComponent = () => {
  const dispatch = useDispatch();
  const mnemonic = useSelector(getMnemonic);
  const onCopy = useCallback(async() => {
    if (mnemonic === undefined) {
      return;
    }
    await navigator.clipboard.writeText(mnemonic);
    toast('Mnemonic copied to clipboard');
  }, [mnemonic]);
  const onProceed = useCallback(async() => {
    if (mnemonic === undefined) {
      return;
    }
    dispatch(AccountActions.beginImporting());
    const [
      primaryAddress,
      encryptionKey,
    ] = await IpcRequest.railgunAddressAndKey(mnemonic);
    dispatch(AccountActions.importAccount({
      mnemonic,
      primaryAddress,
      encryptionKey,
    }));
  }, [dispatch, mnemonic]);
  return (
    <div className={styles.confirmWallet}>
      <h2>Your mnemonic is:</h2>
      <p className={styles.mnemonic}>{mnemonic}</p>
      <button type="button" onClick={onCopy}>Copy to Clipboard</button>
      <p>{notice}</p>
      <p className={styles.warning}>{warning}</p>
      <button type="button" onClick={onProceed}>Proceed to Wallet</button>
    </div>
  );
};

export default ConfirmWallet;

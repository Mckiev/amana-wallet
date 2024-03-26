import type { FunctionComponent } from 'react';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { generateMnemonic } from 'bip39';
import { AccountActions } from '../../redux/slices/account';
import railgun from '../../railgun';
import styles from './index.scss';

const notice = 'Your seed phrase above is used to access your new wallet. Please save it somewhere safe. If you lose it, there is no way to recover your mana.';
const warning = 'Only proceed if you have securely stored your seed phrase.';

const ConfirmWallet: FunctionComponent = () => {
  const dispatch = useDispatch();
  const [mnemonic, setMnemonic] = useState<string>(generateMnemonic(128));

  const onGenerate = useCallback(() => {
    setMnemonic(generateMnemonic(128));
  }, []);

  const onCopy = useCallback(async() => {
    await navigator.clipboard.writeText(mnemonic);
    toast('Mnemonic copied to clipboard');
  }, [mnemonic]);
  const onProceed = useCallback(async() => {
    dispatch(AccountActions.beginImporting());
    const [
      primaryAddress,
      encryptionKey,
    ] = await railgun.getAddressAndKey(mnemonic);
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
      <button type="button" onClick={onGenerate}>Generate Another</button>
      <button type="button" onClick={onCopy}>Copy to Clipboard</button>
      <p>{notice}</p>
      <p className={styles.warning}>{warning}</p>
      <button type="button" onClick={onProceed}>Proceed to Wallet</button>
    </div>
  );
};

export default ConfirmWallet;

import type { ChangeEvent, FunctionComponent } from 'react';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AccountActions } from '../../redux/slices/account';
import IpcRequest from '../../IpcRequest';
import styles from './index.scss';

const ImportWallet: FunctionComponent = () => {
  const dispatch = useDispatch();
  const [mnemonic, setMnemonic] = useState('');
  const onChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setMnemonic(e.target.value);
  }, []);
  const onLogin = useCallback(async() => {
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

  const onCreate = useCallback(() => {
    dispatch(AccountActions.beginConfirmation());
  }, [dispatch]);
  const noMnemonicText = "Don't have a mnemonic?";
  return (
    <div className={styles.importWallet}>
      <h2>Import Wallet</h2>
      <textarea
        name="importMnemonic"
        value={mnemonic}
        onChange={onChange}
        placeholder="Enter your mnemonic here..."
        rows={4}
      />
      <button type="button" onClick={onLogin}>Import</button>
      <p>{noMnemonicText}</p>
      <p>
        <a onClick={onCreate}>Create new wallet</a>
      </p>
    </div>
  );
};

export default ImportWallet;

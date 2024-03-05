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
  const onClick = useCallback(async() => {
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
    <div className={styles.importWallet}>
      <h2>Import Wallet</h2>
      <label htmlFor="importMnemonic">Mnemonic:</label>
      <textarea
        name="importMnemonic"
        value={mnemonic}
        onChange={onChange}
        rows={4}
      />
      <button type="button" onClick={onClick}>Import</button>
    </div>
  );
};

export default ImportWallet;

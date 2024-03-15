import type { FunctionComponent } from 'react';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AccountActions } from '../../redux/slices/account';
import IpcRequest from '../../IpcRequest';
import styles from './index.scss';

const GenerateWallet: FunctionComponent = () => {
  const dispatch = useDispatch();
  const [mnemonic, setMnemonic] = useState<string>();
  const onGenerate = useCallback(async() => {
    const generatedMnemonic = await IpcRequest.mnemonic();
    setMnemonic(generatedMnemonic);
  }, []);
  const onProceed = useCallback(() => {
    if (mnemonic === undefined) {
      return;
    }
    dispatch(AccountActions.beginConfirmation(mnemonic));
  }, [dispatch, mnemonic]);
  return (
    <div className={styles.generateWallet}>
      <h2>Generate Wallet</h2>
      <label htmlFor="generateMnemonic">Generated mnemonic:</label>
      <textarea
        name="generateMnemonic"
        value={mnemonic}
        rows={4}
        disabled
      />
      <button type="button" onClick={onGenerate}>Generate</button>
      <button type="button" onClick={onProceed} disabled={mnemonic === undefined}>Proceed</button>
    </div>
  );
};

export default GenerateWallet;

import type { FunctionComponent } from 'react';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { AccountActions } from '../../redux/slices/account';
import styles from './index.scss';
import IpcRequest from '../../IpcRequest';

enum Step {
  Generate = 'Generate',
  Copy = 'Copy',
  Import = 'Import',
};

const getButtonText = (step: Step): string => ({
  [Step.Generate]: 'Generate Mnemonic',
  [Step.Copy]: 'Copy Mnemonic to Clipboard',
  [Step.Import]: 'Proceed to Wallet',
})[step];

const GenerateWallet: FunctionComponent = () => {
  const dispatch = useDispatch();
  const [mnemonic, setMnemonic] = useState<string>();
  const [step, setStep] = useState(Step.Generate);
  const buttonText = getButtonText(step);
  const onClick = useCallback(async() => {
    if (step === Step.Generate) {
      const generatedMnemonic = await IpcRequest.Mnemonic();
      setMnemonic(generatedMnemonic);
      setStep(Step.Copy);
      return;
    }
    if (mnemonic === undefined) {
      throw new Error('Unexpected undefined mnemonic');
    }
    if (step === Step.Copy) {
      navigator.clipboard.writeText(mnemonic);
      toast('Mnemonic copied to clipboard');
      setStep(Step.Import);
    } else {
      const primaryAddress: string = await IpcRequest.RailgunAddress(mnemonic);
      dispatch(AccountActions.importAccount({
        mnemonic,
        primaryAddress,
      }));
    }
  }, [step, mnemonic]);
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
      <button type="button" onClick={onClick}>{buttonText}</button>
    </div>
  );
};

export default GenerateWallet;

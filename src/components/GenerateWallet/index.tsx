import type { FunctionComponent } from 'react';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { generateMnemonic } from 'bip39';
import { useDispatch } from 'react-redux';
import { createPrimaryAddress } from '../../railgun/utils';
import { AccountActions } from '../../redux/slices/account';
import styles from './index.scss';
import { toast } from 'react-toastify';

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
      setMnemonic(generateMnemonic(128));
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
      const primaryAddress = await createPrimaryAddress(mnemonic);
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

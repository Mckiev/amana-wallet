import type { FunctionComponent } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import { getIsImporting, getIsLoggedIn } from '../../redux/selectors';
import ImportWallet from '../ImportWallet';
import GenerateWallet from '../GenerateWallet';
import styles from './index.scss';

const LoginModal: FunctionComponent = () => {
  const isLoggedIn = useSelector(getIsLoggedIn);
  const isImporting = useSelector(getIsImporting);
  if (isLoggedIn) {
    return null;
  }
  if (isImporting) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <h1>Importing wallet...</h1>
          <div className={styles.spinner} />
        </div>
      </div>
    );
  }
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <ImportWallet />
        <GenerateWallet />
      </div>
    </div>
  );
};

export default LoginModal;

import type { FunctionComponent } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import { getIsLoggedIn } from '../../redux/selectors';
import ImportWallet from '../ImportWallet';
import GenerateWallet from '../GenerateWallet';
import styles from './index.scss';

const LoginModal: FunctionComponent = () => {
  const isLoggedIn = useSelector(getIsLoggedIn);
  if (isLoggedIn) {
    return null;
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

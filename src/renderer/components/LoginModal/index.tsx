import type { FunctionComponent } from 'react';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { getIsImporting, getIsLoggedIn } from '../../redux/selectors';
import ImportWallet from '../ImportWallet';
import GenerateWallet from '../GenerateWallet';
import Modal from '../Modal';
import styles from './index.scss';

const importingContent = (
  <Fragment>
    <h1>Importing wallet...</h1>
    <div className={styles.spinner} />
  </Fragment>
);

const loginContent = (
  <Fragment>
    <ImportWallet />
    <GenerateWallet />
  </Fragment>
);

const LoginModal: FunctionComponent = () => {
  const isLoggedIn = useSelector(getIsLoggedIn);
  const isImporting = useSelector(getIsImporting);
  const content = isImporting ? importingContent : loginContent;
  return (
    <Modal isOpen={!isLoggedIn}>
      <div className={styles.loginModal}>
        {content}
      </div>
    </Modal>
  );
};

export default LoginModal;

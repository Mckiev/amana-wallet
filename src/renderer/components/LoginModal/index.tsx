import type { FunctionComponent } from 'react';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { getLoginState } from '../../redux/selectors';
import ImportWallet from '../ImportWallet';
import Modal from '../Modal';
import ConfirmWallet from '../ConfirmWallet';
import { LoginState } from '../../redux/slices/account';
import styles from './index.scss';

const importingContent = (
  <Fragment>
    <h1>Importing wallet</h1>
    <h2>May take a minute or two ...</h2>
    <div className={styles.spinner} />
  </Fragment>
);

const LoginModal: FunctionComponent = () => {
  const loginState = useSelector(getLoginState);
  const content = {
    [LoginState.Entering]: <ImportWallet />,
    [LoginState.Importing]: importingContent,
    [LoginState.Confirming]: <ConfirmWallet />,
    [LoginState.LoggedIn]: null,
  }[loginState];

  return (
    <Modal isOpen={loginState !== LoginState.LoggedIn}>
      <div className={styles.loginModal}>
        {content}
      </div>
    </Modal>
  );
};

export default LoginModal;

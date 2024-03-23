import type { FunctionComponent, PropsWithChildren } from 'react';
import React from 'react';
import styles from './index.scss';

type Props = PropsWithChildren<{
  isOpen: boolean;
}>;

const Modal: FunctionComponent<Props> = ({ children, isOpen }) => {
  if (!isOpen) {
    return null;
  }
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {children}
      </div>
    </div>
  );
};

export default Modal;

import type { FunctionComponent } from 'react';
import React from 'react';
import styles from './index.scss';
import CopyableAddress from '../CopyableAddress';

const Title: FunctionComponent = () => (
  <div className={styles.title}>
    <h1>AMANA Wallet</h1>
    <h2><CopyableAddress /></h2>
  </div>
);

export default Title;

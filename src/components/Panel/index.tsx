import type { FunctionComponent, PropsWithChildren } from 'react';
import React from 'react';
import styles from './index.scss';

type Props = PropsWithChildren<{}>;

const Panel: FunctionComponent<Props> = ({ children }) => (
  <div className={styles.panel}>
    {children}
  </div>
);

export default Panel;

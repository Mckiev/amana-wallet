import type { FunctionComponent } from 'react';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { FaCopy } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getPrimaryAddress, getShortPrimaryAddress } from '../../redux/selectors';
import styles from './index.scss';

const CopyableAddress: FunctionComponent = () => {
  const primaryAddress = useSelector(getPrimaryAddress);
  const shortPrimaryAddress = useSelector(getShortPrimaryAddress);
  const onCopy = useCallback((async() => {
    if (primaryAddress === undefined) {
      return;
    }
    await navigator.clipboard.writeText(primaryAddress);
    toast('Primary address copied to clipboard');
  }), [primaryAddress]);
  return (
    <span className={styles.copyableAddress} onClick={onCopy}>
      <FaCopy />
      {' '}
      {shortPrimaryAddress ?? '0zk...'}
    </span>
  );
};

export default CopyableAddress;
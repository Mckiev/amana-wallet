import type { FunctionComponent } from 'react';
import React, { useCallback } from 'react';
import { FaCopy } from 'react-icons/fa';
import { toast } from 'react-toastify';
import styles from './index.scss';

type Props = {
  copyText: string;
  displayText: string;
  toastText: string | React.ReactNode;
};

const CopyableText: FunctionComponent<Props> = ({
  copyText,
  displayText,
  toastText,
}) => {
  const onCopy = useCallback((async() => {
    await navigator.clipboard.writeText(copyText);
    toast(toastText);
  }), [copyText, toastText]);
  return (
    <span className={styles.copyableText} onClick={onCopy}>
      <FaCopy />
      {' '}
      {displayText}
    </span>
  );
};

export default CopyableText;

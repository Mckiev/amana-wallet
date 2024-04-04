import type { FunctionComponent } from 'react';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import Panel from '../Panel';
import CopyableText from '../CopyableText';
import { getPrimaryAddress, getShortPrimaryAddress } from '../../redux/selectors';
import constants from '../../constants';

const Deposit: FunctionComponent = () => {
  const text1 = 'Send Mana to ';
  const text2 = constants.MANIFOLD.BOT_USERNAME;
  const text3 = ' with the message: (';
  const text4 = ')';
  const primaryAddress = useSelector(getPrimaryAddress) ?? '';
  const shortAddress = useSelector(getShortPrimaryAddress) ?? '0zk...';
  const onDeposit = useCallback(() => {
    const depositLink = `https://manifold.markets/${constants.MANIFOLD.BOT_USERNAME}?tab=payments&a=200&msg=${primaryAddress}`;
    window.open(
      depositLink,
      '_blank',
      'noreferrer,noopener',
    );
  }, [primaryAddress]);
  return (
    <Panel>
      <h2>Deposit to AMANA</h2>
      <p>
        {text1}
        <b>{text2}</b>
        {text3}
        <CopyableText copyText={primaryAddress} displayText={shortAddress} toastText="Primary Address copied to clipboard" />
        {text4}
      </p>
      <p>Deposits take approximately one minute to arrive</p>
      <button type="button" onClick={onDeposit}>Deposit on Manifold</button>
    </Panel>
  );
};

export default Deposit;

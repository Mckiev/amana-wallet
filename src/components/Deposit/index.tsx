import type { FunctionComponent } from 'react';
import React from 'react';
import Panel from '../Panel';
import CopyableText from '../CopyableText';
import { useSelector } from 'react-redux';
import { getPrimaryAddress, getShortPrimaryAddress } from '../../redux/selectors';

const Deposit: FunctionComponent = () => {
  const text1 = 'Send Mana to ';
  const text2 = 'TestAmanaBot';
  const text3 = ' with the message: (';
  const text4 = ')';
  const primaryAddress = useSelector(getPrimaryAddress) ?? '';
  const shortAddress = useSelector(getShortPrimaryAddress) ?? '0zk...';
  return (
    <Panel>
      <h2>Deposit to AMANA</h2>
      <p>
        {text1}
        <b>{text2}</b>
        {text3}
        <CopyableText copyText={primaryAddress} displayText={shortAddress} toastText='Primary Address copied to clipboard' />
        {text4}
      </p>
      <p> <a href={`https://manifold.markets/TestAmanaBot?tab=payments&a=10&msg=${primaryAddress}`} target="_blank" rel="noreferrer noopener"> Procced to Manifold to Deposit </a> </p>
      <p>Takes ~ a minute for a transfer to arrive</p>
    </Panel>
  );
};

export default Deposit;

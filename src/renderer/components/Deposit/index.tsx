import type { FunctionComponent } from 'react';
import React from 'react';
import Panel from '../Panel';
import CopyableAddress from '../CopyableAddress';

const Deposit: FunctionComponent = () => {
  const text1 = 'Send Mana to ';
  const text2 = 'TestAmanaBot';
  const text3 = ' with the message: (';
  const text4 = ')';
  return (
    <Panel>
      <h2>Deposit to AMANA</h2>
      <p>
        {text1}
        <b>{text2}</b>
        {text3}
        <b><CopyableAddress /></b>
        {text4}
      </p>
      <p> <b>Link</b> : https://manifold.markets/TestAmanaBot?tab=payments&a=1</p>
      <p>Takes ~ a minute for a transfer to arrive</p>
    </Panel>
  );
};

export default Deposit;

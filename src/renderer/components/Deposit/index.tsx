import type { FunctionComponent } from 'react';
import React from 'react';
import Panel from '../Panel';
import CopyableAddress from '../CopyableAddress';

const Deposit: FunctionComponent = () => {
  const text1 = 'Use the "Send" feature on Manifold to initiate a deposit. Enter ';
  const text2 = 'AmanaBot';
  const text3 = ' in the "To" field, the size of your deposit in the "Amount" field, and your address (';
  const text4 = ') in the "Message" field.';
  return (
    <Panel>
      <h2>Deposit</h2>
      <p>
        {text1}
        <b>{text2}</b>
        {text3}
        <b><CopyableAddress /></b>
        {text4}
      </p>
    </Panel>
  );
};

export default Deposit;

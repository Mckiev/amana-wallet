import type { FunctionComponent } from 'react';
import React from 'react';
import Panel from '../Panel';
import CopyableAddress from '../CopyableAddress';

const Deposit: FunctionComponent = () => (
  <Panel>
    <h2>Deposit</h2>
    <p>
      Use the "Send" feature on Manifold to initiate a deposit. Enter
      {' '}
      <b>AmanaBot</b>
      {' '}
      in the "To" field, the size of your deposit in the "Amount" field, and your address (
      <b><CopyableAddress /></b>
      ) in the "Message" field.
    </p>
  </Panel>
);

export default Deposit;

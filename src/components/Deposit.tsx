import React, { FunctionComponent } from 'react';

type Props = {
  address: string;
}

const Deposit: FunctionComponent<Props> = ({ address }) => {
  return (
    <div>
      <h2>Deposit</h2>
      <p>Use the "Send" feature on Manifold to initiate a deposit. Enter <b>AmanaBot</b> in the "To" field, the size of your deposit in the "Amount" field, and your address (<b>{address}</b>) in the "Message" field.</p>
    </div>
  );
};

export default Deposit;
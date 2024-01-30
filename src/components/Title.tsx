import React, { FunctionComponent } from 'react';

type Props = {
  address: string;
};

const Title: FunctionComponent<Props> = ({ address }) => {
  return (
    <div>
      <h1>AMANA Wallet</h1>
      <h2>{address}</h2>
    </div>
  );
};

export default Title;
import React, { FunctionComponent } from 'react';
import Title from './Title';
import Deposit from './Deposit';
import Withdraw from './Withdraw';
import Bet, { Prediction } from './Bet';
import Positions, { Position } from './Positions';
import Logs from './Logs';

const Overview: FunctionComponent = () => {
  const mnemonic = 'test';
  const address = '0zkabc123...';
  const positions: Position[] = [
    {
      url: 'https://manifold.markets/josh/will-openofficeorg-be-officially-de',
      prediction: Prediction.Yes,
      shares: 500,
    },
    {
      url: 'https://manifold.markets/toms/will-an-accredited-us-college-or-un',
      prediction: Prediction.No,
      shares: 250,
    },
    {
      url: 'https://manifold.markets/Sss19971997/will-llama3-use-dpo',
      prediction: Prediction.Yes,
      shares: 400,
    },
  ];
  const logs = [
    'log abc',
    'log def',
    'log 123',
  ]
  return (
    <div>
      <Title address={address} />
      <Deposit address={address} />
      <Withdraw />
      <Bet />
      <Positions positions={positions} />
      <Logs logs={logs} />
    </div>
  );
}

export default Overview;
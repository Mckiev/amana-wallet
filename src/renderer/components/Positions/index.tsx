import type { FunctionComponent } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import Panel from '../Panel';
import { getPositions } from '../../redux/selectors';
import PositionDisplay from '../PositionDisplay';

const Positions: FunctionComponent = () => {
  const positions = useSelector(getPositions);
  return (
    <Panel>
      <h2>Positions</h2>
      {positions.map(position => <PositionDisplay position={position} />)}
    </Panel>
  );
};

export default Positions;

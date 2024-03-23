import type { FunctionComponent } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import Panel from '../Panel';
import { getPositions } from '../../redux/selectors';
import PositionDisplay from '../PositionDisplay';
import RedemptionModal from '../RedemptionModal';

const Positions: FunctionComponent = () => {
  const positions = useSelector(getPositions);
  return (
    <Panel>
      <h2>Positions</h2>
      {positions.map(position => (
        <PositionDisplay key={position.id} position={position} />
      ))}
      <RedemptionModal />
    </Panel>
  );
};

export default Positions;

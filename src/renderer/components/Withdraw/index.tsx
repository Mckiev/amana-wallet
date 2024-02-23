import type { FunctionComponent } from 'react';
import React, { useCallback, useState } from 'react';
import Panel from '../Panel';

enum Status {
  None = 'None',
  Submitting = 'Requesting',
  Confirming = 'Confirming',
  Confirmed = 'Confirmed',
  Error = 'Error',
}

const Withdraw: FunctionComponent = () => {
  const [status, setStatus] = useState(Status.None);

  const onClick = useCallback(() => {
    if (status === Status.None) {
      setStatus(Status.Error);
    }
  }, [status]);

  return (
    <Panel>
      <h2>Withdraw</h2>
      <label htmlFor="manifoldUser">Manifold user: </label>
      <input type="text" name="manifoldUser" />
      <label htmlFor="withdrawalAmount">Withdrawal amount: </label>
      <input type="number" name="withdrawalAmount" />
      <button type="button" onClick={onClick}>Withdraw</button>
      <p>
        Status:
        {status}
      </p>
    </Panel>
  );
};

export default Withdraw;

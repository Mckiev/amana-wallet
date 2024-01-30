import React, { FunctionComponent } from 'react';

const Withdraw: FunctionComponent = () => {
  return (
    <div>
      <h2>Withdraw</h2>
      <label htmlFor="manifoldUser">Manifold user: </label>
      <input type="text" name="manifoldUser" />
      <br />
      <label htmlFor="withdrawalAmount">Withdrawal amount: </label>
      <input type="number" name="withdrawalAmount" />
      <br />
      <button type="button">Withdraw</button>
      <p>Status: ------</p>
    </div>
  );
};

export default Withdraw;
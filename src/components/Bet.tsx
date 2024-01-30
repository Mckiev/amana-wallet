import React, { FunctionComponent, useCallback, useState } from 'react';

export enum Prediction {
  Unselected = 'Unselected',
  Yes = 'Yes',
  No = 'No',
};

const Bet: FunctionComponent = () => {
  const [prediction, setPrediction] = useState(Prediction.Unselected);

  const onClickYes = useCallback(() => {
    setPrediction(Prediction.Yes);
  }, []);
  const onClickNo = useCallback(() => {
    setPrediction(Prediction.No);
  }, []);

  const yes = prediction === Prediction.Yes
    ? <b>Yes</b>
    : <span onClick={onClickYes}>Yes</span>;

  const no = prediction === Prediction.No
    ? <b>No</b>
    : <span onClick={onClickNo}>No</span>;

  return (
    <div>
      <h2>Bet</h2>
      <label htmlFor="manifoldUrl">Manifold Slug/URL</label>
      <input type="text" name="manifoldUrl" />
      <br />
      <p>Prediction: {yes} {no}</p>
      <label htmlFor="betAmount">Bet amount: </label>
      <input type="number" name="betAmount" />
      <br />
      <button type="button">Place Bet</button>
      <p>Status: ------</p>
    </div>
  );
};

export default Bet;
import constants from '../common/constants';
import { isObjectRecord } from '../common/types';
import type { BetState, Position, Prediction } from './types';
import store from './redux/store';
import { PositionsActions } from './redux/slices/positions';

type Bet = {
  id: string;
  timestamp: string;
  railgunTransactionId: string;
  amount: string;
  marketUrl: string;
  marketId: string;
  prediction: Prediction;
  redemptionAddress: string;
  betId: string | undefined;
  nShares: number | undefined;
  state: BetState;
};

const isBet = (value: unknown): value is Bet => (
  isObjectRecord(value)
    && typeof value.id === 'string'
    && typeof value.timestamp === 'string'
    && typeof value.railgunTransactionId === 'string'
    && typeof value.amount === 'string'
    && typeof value.marketUrl === 'string'
    && typeof value.marketId === 'string'
    && typeof value.prediction === 'string'
    && ['YES', 'NO'].includes(value.prediction)
    && typeof value.redemptionAddress === 'string'
    && (typeof value.betId === 'string' || value.betId === undefined)
    && (typeof value.nShares === 'number' || value.nShares === undefined)
    && typeof value.state === 'string'
);

const betToPosition = (bet: Bet): Position => ({
  id: bet.id,
  url: bet.marketUrl,
  prediction: bet.prediction,
  shares: bet.nShares ?? 0,
  state: bet.state,
  timestamp: Number.parseInt(bet.timestamp, 10),
  purchasePrice: Number.parseInt(bet.amount, 10),
  redemptionAddress: bet.redemptionAddress,
});

const getRedemptionAddresses = (): string[] => {
  const bets = store.getState().logs.transactions.filter(transaction => (
    transaction.memoText?.startsWith('bet::') ?? false
  ));
  return bets.map(bet => bet.memoText?.split('::').pop() ?? '');
};

const fetchPositions = async(): Promise<void> => {
  const endpoint = `${constants.RELAYER_HOST}/positions`;
  const response = await fetch(endpoint);
  const data: unknown = await response.json();
  const positions: Position[] = [];
  const redemptionAddresses = getRedemptionAddresses();
  if (Array.isArray(data)) {
    for (const item of data) {
      if (isBet(item) && redemptionAddresses.includes(item.redemptionAddress)) {
        positions.push(betToPosition(item));
      }
    }
  }
  const action = PositionsActions.setPositions(positions);
  store.dispatch(action);
  setTimeout(fetchPositions, 10_000);
};

const initialize = async(): Promise<void> => {
  await fetchPositions();
};

export default {
  initialize,
};

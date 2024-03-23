import { Logger } from './logger';
import render from './render';
import railgun from './railgun';
import DataFetcher from './DataFetcher';

const main = async(): Promise<void> => {
  render();
  await railgun.initialize();
  await DataFetcher.initialize();
};

main().catch((e: unknown) => {
  if (e instanceof Error) {
    Logger.fatal(e.message);
  } else if (typeof e === 'string') {
    Logger.fatal(e);
  } else {
    Logger.fatal('Unknown error');
  }
});

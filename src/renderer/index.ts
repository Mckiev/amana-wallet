import Logger, { LogLevel } from 'eleventh';
import render from './render';
import DataFetcher from './DataFetcher';

Logger.setLogLevel(LogLevel.debug);

const main = async(): Promise<void> => {
  render();
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
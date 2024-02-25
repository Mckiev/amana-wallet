import Logger, { LogLevel } from 'eleventh';
import render from './render';

Logger.setLogLevel(LogLevel.debug);

const main = (): void => {
  render();
};

try {
  main();
} catch (e) {
  if (e instanceof Error) {
    Logger.fatal(e.message);
  } else if (typeof e === 'string') {
    Logger.fatal(e);
  } else {
    Logger.fatal('Unknown error');
  }
}

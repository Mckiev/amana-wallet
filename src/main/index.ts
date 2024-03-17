import Logger, { LogLevel } from 'eleventh';
import Server from './Server';
import WindowManager from './WindowManager';

Logger.setLogLevel(LogLevel.debug);

const main = async(): Promise<void> => {
  Server.initialize();
  await WindowManager.initialize();
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

import Logger, { LogLevel } from 'eleventh';
import './globals';
import render from './render';

Logger.setLogLevel(LogLevel.debug);

const main = async () => {
  render();
};

main().catch(console.error);

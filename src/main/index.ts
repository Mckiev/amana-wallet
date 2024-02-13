import Server from './Server';
import WindowManager from './WindowManager';

const main = () => {
  Server.initialize();
  WindowManager.initialize();
};

main();
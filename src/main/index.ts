import Server from './Server';
import WindowManager from './WindowManager';
import Railgun from './railgun';

const main = () => {
  Server.initialize();
  WindowManager.initialize();
  Railgun.initialize();
};

main();

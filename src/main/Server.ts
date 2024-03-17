// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcMain } from 'electron';
import { generateMnemonic } from 'bip39';
import { pbkdf2 } from '@railgun-community/wallet';
import { IpcChannel } from '../common/ipcChannels';
import type { TransactionLog } from '../common/types';
import constants from '../common/constants';
import Railgun from './railgun';
import WindowManager from './WindowManager';

const initialize = (): void => {
  ipcMain.handle(IpcChannel.Mnemonic, () => {
    const mnemonic = generateMnemonic(128);
    return mnemonic;
  });

  ipcMain.handle(
    IpcChannel.RailgunAddressAndKey,
    async(e, mnemonic: string) => {
      const saltMessage = 'amana-wallet-identifier';
      const salt = Buffer.from(saltMessage).toString('hex');
      const iterations = 100000;
      const identifier = (await pbkdf2(mnemonic, salt, iterations))
        .slice(0, 16);
      await Railgun.initialize(identifier);
      const { wallet, encryptionKey } = await Railgun.getWalletAndKey(mnemonic);
      const address = wallet.getAddress();
      return { railgunAddress: address, encryptionKey };
    }
  );

  ipcMain.handle(
    IpcChannel.Withdraw,
    async(
      e,
      mnemonic: string,
      encryptionKey: string,
      amount: bigint,
      manifoldUser: string
    ) => {
      await Railgun.withdraw(mnemonic, encryptionKey, amount, manifoldUser);
    }
  );

  ipcMain.handle(
    IpcChannel.Bet,
    async(
      e,
      mnemonic: string,
      encryptionKey: string,
      amount: bigint,
      marketUrl: string,
      prediction: string,
    ) => {
      await Railgun.bet(
        mnemonic,
        encryptionKey,
        amount,
        marketUrl,
        prediction
      );
    }
  );

  ipcMain.handle(
    IpcChannel.Redeem,
    async(
      e,
      mnemonic: string,
      encryptionKey: string,
      redemptionAddress: string,
    ) => {
      const signature = await Railgun.signRedemption(
        mnemonic,
        encryptionKey,
        redemptionAddress,
      );
      const endpoint = `${constants.RELAYER_HOST}/redeem`;
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          redemptionAddress,
          signature,
        }),
      });
    }
  );

  Railgun.events.on('balance', (balance: bigint) => {
    const mainWindow = WindowManager.getMainWindow();
    mainWindow?.webContents.send('Balance', balance);
  });

  Railgun.events.on('transactions', (transactions: TransactionLog) => {
    const mainWindow = WindowManager.getMainWindow();
    mainWindow?.webContents.send('Transactions', transactions);
  });
};

export default {
  initialize,
};

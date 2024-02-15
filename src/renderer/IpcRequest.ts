import { ipcRenderer } from 'electron';
import { IpcChannel } from '../common/ipcChannels';

type IpcRequest = (...parameters: any[]) => Promise<any>;
type IpcRequests = Record<IpcChannel, IpcRequest>;

const IpcRequest: IpcRequests = {
  [IpcChannel.Mnemonic]: async (): Promise<string> => {
    const mnemonic = await ipcRenderer.invoke(IpcChannel.Mnemonic);
    return mnemonic;
  },
  [IpcChannel.RailgunAddress]: async (mnemonic: string): Promise<string> => {
    const railgunAddress = await ipcRenderer.invoke(IpcChannel.RailgunAddress, mnemonic);
    return railgunAddress;
  },
};

export default IpcRequest;

import { ipcRenderer } from "electron"

export default async () => {
  const mnemonic = await ipcRenderer.invoke('mnemonic');
  return mnemonic;
}

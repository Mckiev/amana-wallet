import type { SnarkJSGroth16, POIList } from '@railgun-community/wallet';
import {
  startRailgunEngine,
  getProver,
  loadProvider,
  setLoggers,
  createRailgunWallet,
  pbkdf2,
  walletForID,
  refreshBalances,
  setOnBalanceUpdateCallback,
} from '@railgun-community/wallet';
import type { FallbackProviderJsonConfig } from '@railgun-community/shared-models';
import {
  NETWORK_CONFIG,
  NetworkName,
} from '@railgun-community/shared-models';
import { Level } from 'level';
import { groth16 } from 'snarkjs';
import { createArtifactStore } from './create-artifact-store';

const initializeEngine = async(): Promise<void> => {
  const walletSource = 'amanawallet';
  const db = new Level('engine', { valueEncoding: 'json' });
  const shouldDebug = true;
  const artifactStore = createArtifactStore();
  const useNativeArtifacts = false;
  const skipMerkletreeScans = false;
  const poiNodeURLs: string[] = [];
  const customPOILists: POIList[] = [];
  const verboseScanLogging = true;

  await startRailgunEngine(
    walletSource,
    db,
    shouldDebug,
    artifactStore,
    useNativeArtifacts,
    skipMerkletreeScans,
    poiNodeURLs,
    customPOILists,
    verboseScanLogging
  );
};

const loadEngineProvider = async(): Promise<void> => {
  const POLYGON_PROVIDERS_JSON: FallbackProviderJsonConfig = {
    chainId: 137,
    providers: [
      // The following are example providers. Use your preferred providers here.
      {
        provider: 'https://rpc.ankr.com/polygon',
        priority: 1,
        weight: 1,
      },
      {
        provider: 'https://1rpc.io/matic',
        priority: 2,
        weight: 1,
      },
    ],
  };

  const { feesSerialized } = await loadProvider(
    POLYGON_PROVIDERS_JSON,
    NetworkName.Polygon,
  );
};

const setEngineLoggers = (): void => {
  const logMessage = (msg?: unknown) => console.log(msg);
  const logError = (err?: unknown) => console.error(err);
  setLoggers(logMessage, logError);
};

const creationBlockNumberMap = {
  [NetworkName.Polygon]: 52151390,
};

const main = async() => {
  console.log('--- initializing engine ---');
  await initializeEngine();
  console.log('--- loading provider ---');
  await loadEngineProvider();
  console.log('--- setting loggers ---');
  setEngineLoggers();

  // Note: SnarkJS library does not have proper typings.
  // const groth16 = (global as unknown as { snarkjs: { groth16: SnarkJSGroth16 } })
  //       .snarkjs.groth16;
  // getProver().setSnarkJSGroth16(groth16);

  const groth: unknown = groth16;

  getProver().setSnarkJSGroth16(groth as SnarkJSGroth16);

  console.log('--- setting onBalanceUpdateCallback ---');
  setOnBalanceUpdateCallback((e) => {
    console.log('--- onBalanceUpdateCallback ---');
    console.log(e);
  });

  console.log('--- engine initialized ---');

  const mnemonic = 'just chimney better cattle decide design exact struggle kind mandate decide genius';
  const salt = '0101010101010101';
  const iterations = 100000;
  const primaryEncryptionKey = await pbkdf2(mnemonic, salt, iterations);
  const railgunWalletInfo = await createRailgunWallet(
    primaryEncryptionKey,
    mnemonic,
    creationBlockNumberMap,
  );
  const wallet = walletForID(railgunWalletInfo.id);
  const { chain } = NETWORK_CONFIG[NetworkName.Polygon];
  console.log('--- refreshing balances ---');
  await refreshBalances(chain, [railgunWalletInfo.id]);
  console.log('--- balances refreshed ---');
};

// import { setEngineLoggers, initializeEngine, creationBlockNumberMap, loadEngineProvider } from './engine';

export {
  setEngineLoggers,
  initializeEngine,
  creationBlockNumberMap,
  loadEngineProvider,
};

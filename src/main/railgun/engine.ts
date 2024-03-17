import path from 'node:path';
// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron';
import type { SnarkJSGroth16 } from '@railgun-community/wallet';
import { getProver, loadProvider, setLoggers, startRailgunEngine } from '@railgun-community/wallet';
import type { FallbackProviderJsonConfig } from '@railgun-community/shared-models';
import { NetworkName } from '@railgun-community/shared-models';
import type { POIList } from '@railgun-community/engine';
import { groth16 } from 'snarkjs';
import Level from 'leveldown';
import Logger from 'eleventh';
import { createArtifactStore } from './create-artifact-store';

export type Optional<T> = T | null | undefined;

type MapType<T> = {
  [key in NetworkName]?: T;
};

export const setEngineLoggers = (): void => {
  setLoggers(
    (message: string) => {
      Logger.info(message);
    },
    (error: string | Error) => {
      if (typeof error === 'string') {
        Logger.error(error);
      } else {
        Logger.error(error.message);
      }
    },
  );
};

export const initializeEngine = async(identifier: string): Promise<void> => {
  // Name for your wallet implementation.
  // Encrypted and viewable in private transaction history.
  // Maximum of 16 characters, lowercase.
  const walletSource = 'AMANA RAILGUN';

  // LevelDOWN compatible database for storing encrypted wallets.
  const appDataPath = app.getPath('appData');
  const dbPath = path.join(appDataPath, `amanawallet-${identifier}-engine`);
  const db = new Level(dbPath);

  // Whether to forward Engine debug logs to Logger.
  const shouldDebug = true;

  // Persistent store for downloading large artifact files required by Engine.
  const artifactPath = path.join(appDataPath, `amanawallet-${identifier}-artifacts`);
  const artifactStore = createArtifactStore(artifactPath);

  // Whether to download native C++ or web-assembly artifacts.
  // True for mobile. False for nodejs and browser.
  const useNativeArtifacts = false;

  // Whether to skip merkletree syncs and private balance scans.
  // Only set to TRUE in shield-only applications that don't
  // load private wallets or balances.
  const skipMerkletreeScans = false;

  // For more information: https://docs.railgun.org/wiki/assurance/private-proofs-of-innocence
  const poiNodeURLs: string[] = [];

  // Add a custom list to check Proof of Innocence against.
  // Leave blank to use the default list for the aggregator node provided.
  const customPOILists: POIList[] = [];

  // Set to true to view verbose logs for private balance and TXID scans
  const verboseScanLogging = false;

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
  const snarkGroth16: unknown = groth16;

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  getProver().setSnarkJSGroth16(snarkGroth16 as SnarkJSGroth16);
};

// Block numbers for each chain when wallet was first created.
// If unknown, provide undefined.
export const creationBlockNumberMap: MapType<number> = {
  [NetworkName.Polygon]: 52151390,
};

// const polygonInfuraApi = process.env.POLYGON_INFURA_API ?? '';
export const loadEngineProvider = async(): Promise<void> => {
  const POLYGON_PROVIDERS_JSON: FallbackProviderJsonConfig = {
    chainId: 137,
    providers: [
      // The following are example providers. Use your preferred providers here.
      {
        provider: 'https://1rpc.io/matic',
        priority: 2,
        weight: 1,
      },
      {
        provider: 'https://polygon-bor.publicnode.com',
        priority: 1,
        weight: 1,
      },
    ],
  };

  const pollingInterval = 5000; // 5 seconds

  await loadProvider(
    POLYGON_PROVIDERS_JSON,
    NetworkName.Polygon,
    pollingInterval,
  );
};

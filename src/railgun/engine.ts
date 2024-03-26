import type { SnarkJSGroth16, POIList } from '@railgun-community/wallet';
import {
  startRailgunEngine,
  getProver,
  loadProvider,
  setLoggers,
} from '@railgun-community/wallet';
import type { FallbackProviderJsonConfig } from '@railgun-community/shared-models';
import { NetworkName } from '@railgun-community/shared-models';
import { Level } from 'level';
import { groth16 } from 'snarkjs';
import { Logger } from '../logger';
import { createArtifactStore } from './create-artifact-store';

const creationBlockNumberMap = {
  [NetworkName.Polygon]: 52151390,
};

const loadEngineProvider = async(): Promise<void> => {
  const POLYGON_PROVIDERS_JSON: FallbackProviderJsonConfig = {
    chainId: 137,
    providers: [
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

  await loadProvider(
    POLYGON_PROVIDERS_JSON,
    NetworkName.Polygon,
  );

  const groth: unknown = groth16;
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  getProver().setSnarkJSGroth16(groth as SnarkJSGroth16);
};

const setEngineLoggers = (): void => {
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

  await loadEngineProvider();
  setEngineLoggers();
};

export {
  initializeEngine,
  creationBlockNumberMap,
};

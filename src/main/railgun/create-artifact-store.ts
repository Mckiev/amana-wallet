import fs from 'fs';
import { ArtifactStore } from '@railgun-community/wallet';

const createDownloadDirPath = (documentsDir: string, path: string): string => `${documentsDir}/${path}`;

export const createArtifactStore = (documentsDir: string): ArtifactStore => {
  const getFile = async(path: string): Promise<Buffer> => (
    fs.promises.readFile(createDownloadDirPath(documentsDir, path))
  );

  const storeFile = async(
    dir: string,
    path: string,
    item: string | Uint8Array,
  ): Promise<void> => {
    await fs.promises.mkdir(createDownloadDirPath(documentsDir, dir), {
      recursive: true,
    });
    await fs.promises.writeFile(
      createDownloadDirPath(documentsDir, path),
      item,
    );
  };

  const fileExists = async(path: string): Promise<boolean> => (
    new Promise((resolve) => {
      fs.promises
        .access(createDownloadDirPath(documentsDir, path))
        .then(() => resolve(true))
        .catch(() => resolve(false));
    })
  );

  return new ArtifactStore(getFile, storeFile, fileExists);
};

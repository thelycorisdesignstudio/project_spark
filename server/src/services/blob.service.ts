import { getContainerClient } from '../config/azure';
import { v4 as uuidv4 } from 'uuid';

export const uploadAvatar = async (
  buffer: Buffer,
  contentType: string
): Promise<string> => {
  const container = getContainerClient(
    process.env.AZURE_STORAGE_CONTAINER_AVATARS || 'avatars'
  );
  await container.createIfNotExists({ access: 'blob' });

  const ext = contentType.split('/')[1] || 'png';
  const blobName = `${uuidv4()}.${ext}`;
  const blockBlob = container.getBlockBlobClient(blobName);

  await blockBlob.upload(buffer, buffer.length, {
    blobHTTPHeaders: { blobContentType: contentType },
  });

  return blockBlob.url;
};

export const uploadThumbnail = async (
  buffer: Buffer,
  contentType: string
): Promise<string> => {
  const container = getContainerClient(
    process.env.AZURE_STORAGE_CONTAINER_THUMBNAILS || 'thumbnails'
  );
  await container.createIfNotExists({ access: 'blob' });

  const ext = contentType.split('/')[1] || 'png';
  const blobName = `${uuidv4()}.${ext}`;
  const blockBlob = container.getBlockBlobClient(blobName);

  await blockBlob.upload(buffer, buffer.length, {
    blobHTTPHeaders: { blobContentType: contentType },
  });

  return blockBlob.url;
};

export const deleteBlob = async (
  containerName: string,
  blobUrl: string
): Promise<void> => {
  try {
    const container = getContainerClient(containerName);
    const blobName = blobUrl.split('/').pop();
    if (blobName) {
      const blockBlob = container.getBlockBlobClient(blobName);
      await blockBlob.deleteIfExists();
    }
  } catch (error) {
    console.error('Failed to delete blob:', error);
  }
};

import { BlobServiceClient } from '@azure/storage-blob';

let blobServiceClient: BlobServiceClient | null = null;

export const getBlobServiceClient = (): BlobServiceClient => {
  if (!blobServiceClient) {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!connectionString) {
      throw new Error('AZURE_STORAGE_CONNECTION_STRING is not set');
    }
    blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  }
  return blobServiceClient;
};

export const getContainerClient = (containerName: string) => {
  return getBlobServiceClient().getContainerClient(containerName);
};

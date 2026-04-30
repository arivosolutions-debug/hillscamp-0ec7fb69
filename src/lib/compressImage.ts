import imageCompression from 'browser-image-compression';

export async function compressImage(file: File): Promise<File> {
  return await imageCompression(file, {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1600,
    useWebWorker: true,
  });
}
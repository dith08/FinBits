import imageCompression from 'browser-image-compression';

export const compressAndConvertToBase64 = async (file: File): Promise<string> => {
  const options = {
    maxSizeMB: 0.3, 
    maxWidthOrHeight: 500,
    useWebWorker: true,
    initialQuality: 0.7,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    console.log('Original size:', (file.size / 1024).toFixed(2), 'KB');
    console.log('Compressed size:', (compressedFile.size / 1024).toFixed(2), 'KB');
    return fileToBase64(compressedFile);
  } catch (error) {
    console.error('Compression failed, using original:', error);
    return fileToBase64(file);
  }
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const uploadImage = async (file: File): Promise<string> => {
  return compressAndConvertToBase64(file);
};

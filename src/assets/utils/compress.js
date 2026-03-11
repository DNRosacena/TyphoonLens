import imageCompression from 'browser-image-compression';

export async function compressImage(file) {
  const options = {
    maxSizeMB: 0.018,        // ≤18KB — safe for ESP32 heap
    maxWidthOrHeight: 320,   // 320px is enough for AI vision analysis
    useWebWorker: true,
    fileType: 'image/jpeg',
    initialQuality: 0.55,
  };
  const compressed = await imageCompression(file, options);
  return compressed;
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
export function formatFileSize(sizeInMB: number) {
  if (sizeInMB < 1024) {
    return `${sizeInMB}MB`;
  } else {
    const sizeInGB = (sizeInMB / 1024).toFixed(1);
    return `${sizeInGB}GB`;
  }
}

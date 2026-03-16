export const isImageExtension = (file: File): boolean => {
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

  const extension = file.name.split('.').pop()?.toLowerCase();

  if (!extension) return false;

  return allowedExtensions.includes(extension);
};

export const scrollToRails = (elementId: string) => {
  document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

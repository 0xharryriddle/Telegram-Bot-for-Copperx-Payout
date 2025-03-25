export const escapeMarkdownV2 = (text: string) => {
  if (!text) return 'N/A'; // Handle null/undefined cases
  return text.replace(/[-_.*[\]()~`>#+=|{}!]/g, '\\$&'); // Escape Telegram MarkdownV2 special characters
};

export const upperFirstCase = (text: string) => {
  if (!text) return 'N/A'; // Handle null/undefined cases
  return text.charAt(0).toUpperCase() + text.slice(1);
};

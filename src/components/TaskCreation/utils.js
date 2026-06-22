export const getChannelDisplayName = (name) =>
  name ? String(name).replace(/facebook/i, 'Meta') : '';

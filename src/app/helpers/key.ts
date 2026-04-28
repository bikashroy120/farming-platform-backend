export const getKey = (params: Record<string, any>): string => {
  const sortedKeys = Object.keys(params).sort();
  const keyParts = sortedKeys.map(k => `${k}:${params[k]}`).join('&');
  return keyParts ? `${keyParts}` : 'all';
};

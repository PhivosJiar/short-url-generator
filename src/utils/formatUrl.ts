export const formatUrl = (url: string): string => {
  const httpRegex = /^https?:\/\//i;
  if (httpRegex.test(url)) {
    return url;
  }
  return `http://${url}`;
};

export const checkUrlIsValid = (value: string, type: 'url' | 'img') => {
  return !!patternMap[type].test(value);
};

// mapping regular expression rules
const patternMap = {
  url: RegExp(
    '^(https?:\\/\\/)?' + // validate protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ),
  img: RegExp(/\w.(png|jpg|jpeg|svg|webp|gif|bmp)$/i),
};

type HTTPMehod =
  | 'GET'
  | 'POST'
  | 'HEAD'
  | 'PUT'
  | 'CONNECT'
  | 'TRACE'
  | 'PATCH'
  | 'OPTIONS';

export const checkReqMethod = (
  currentMethod: HTTPMehod,
  reqestMethod: string | undefined
) => {
  return reqestMethod === 'OPTIONS' || reqestMethod === currentMethod;
};

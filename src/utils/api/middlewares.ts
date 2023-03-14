import cookie from 'cookie';

// verify request method
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

// verify csrf
export const checkCSRF = (
  cookieString: string | undefined,
  requestBody: any
) => {
  if (!cookieString || !requestBody) return false;

  const cookieCSRFToken = JSON.parse(cookie.parse(cookieString)._csrf);
  const requestBodyCSRFToken = requestBody._csrf;
  delete requestBody._csrf;

  if (!cookieCSRFToken || !requestBodyCSRFToken) return false;

  return cookieCSRFToken === requestBodyCSRFToken;
};

// verify secret key
export const checkSecretKey = (cookieString: string | undefined) => {
  if (!cookieString) return false;
  const cookieSecretKey = JSON.parse(cookie.parse(cookieString).secret_key);

  return cookieSecretKey === `${process.env.NEXT_PUBLIC_SECRET_KEY}`;
};

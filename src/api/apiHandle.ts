import axios from 'axios';
import * as crypto from 'crypto';

let csrfToken = '';

// create a axios instance
const shortUrlRequest = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_HOST}/api`,
});

// axios interceptors
shortUrlRequest.interceptors.request.use(function (config) {
  const newConfig = config;
  // request body append csrf token
  newConfig.data = { ...newConfig.data, _csrf: csrfToken };
  return newConfig;
});

// set axios xsrfCookieName
shortUrlRequest.defaults.xsrfCookieName = '_csrf';

// generate csrf token
export const initCSRFToken = () => {
  csrfToken = crypto.randomBytes(32).toString('hex');
  return csrfToken;
};

export const getShortUrl = (id: string) =>
  shortUrlRequest.get(`/short-url/${id}`);

export const updateVisits = (id: string) =>
  shortUrlRequest.put(`/short-url/${id}/visits`);

export const createShortUrl = (data: {
  title: string | undefined | null;
  description: string | undefined | null;
  imageUrl: string | undefined | null;
  targetUrl: string | undefined | null;
}) => shortUrlRequest.post(`/short-url`, data);

export const verifyUrl = (targetUrl: string) =>
  shortUrlRequest.post(`/url-validation`, { targetUrl });

import axios from 'axios';

// create a axios instance
const shortUrlRequest = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_HOST}/api`,
  headers: { SECRET_KEY: `${process.env.NEXT_PUBLIC_SECRET_KEY}` },
});

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

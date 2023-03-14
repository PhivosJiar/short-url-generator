import { NextApiRequest } from 'next';

import { HttpStatusEnum } from './../enum/http';

// Response body
export type ResBody = {
  message: string;
  data?: {
    [key: string]: unknown;
  };
};

// Define a type for flexible object extension
export type Field = {
  [key: string]: unknown;
};

// Information Required to Create a Shortened URL
export type ReqUrlPreviewInfo = {
  id: string;
  targetUrl?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  visits?: number;
  _csrf?: string;
};

// Information Required to Validation targetUrl
export type reqUrlValidationInfo = {
  targetUrl: string;
};
// Defining POST API /short-url Body.
export interface CreateShortUrlReq extends NextApiRequest {
  body: ReqUrlPreviewInfo;
}

// Defining POST API /url-validation Body.
export interface urlValidationReq extends NextApiRequest {
  body: ReqUrlPreviewInfo;
}

// Defining PATCH API /short-url-info Body.
export type UpdateShortUrlReq = NextApiRequest;

// Expanding Error Type
export class CustomError extends Error {
  httpStatusCode: HttpStatusEnum;
  constructor(httpStatusCode: HttpStatusEnum, message?: string | undefined) {
    super();
    this.httpStatusCode = httpStatusCode;
    if (message) this.message = message;
  }
}

// API short-url response
export type RspShortUrl = {
  shortUrl: string;
};

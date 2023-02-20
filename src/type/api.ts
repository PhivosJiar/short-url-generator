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
  targetUrl: string;
  title?: string;
  description?: string;
  imageUrl?: string;
};

// Defining POST API /short-url Body.
export interface CreateShortUrlReq extends NextApiRequest {
  body: ReqUrlPreviewInfo;
}

// Expanding Error Type
export class CustomError extends Error {
  httpStatusCode: HttpStatusEnum;
  constructor(httpStatusCode: HttpStatusEnum, message?: string | undefined) {
    super();
    this.httpStatusCode = httpStatusCode;
    if (message) this.message = message;
  }
}

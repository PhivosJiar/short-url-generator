import { PrismaClient } from '@prisma/client';
import type { NextApiResponse } from 'next';

import { HttpStatusEnum } from '@/enum/http';
import { CreateShortUrlReq, CustomError, ResBody } from '@/type/api';
import {
  checkCSRF,
  checkReqMethod,
  checkSecretKey,
} from '@/utils/api/middlewares';

const prisma = new PrismaClient();

export default async function handler(
  req: CreateShortUrlReq,
  res: NextApiResponse<ResBody>
) {
  // Initialize response information
  let body: ResBody = { message: 'ok' };
  let status: number = HttpStatusEnum.OK;
  try {
    // Verify request method
    if (!checkReqMethod('PUT', req.method)) {
      throw new CustomError(
        HttpStatusEnum.MethodNotAllowed,
        'Method Now Allowed'
      );
    }

    // Verify csrf token
    if (!checkCSRF(req.headers.cookie, req.body)) {
      throw new CustomError(HttpStatusEnum.Forbidden, '403 Forbidden');
    }

    // verify secret key
    if (!checkSecretKey(req.headers.cookie)) {
      throw new CustomError(HttpStatusEnum.Forbidden, '403 Forbidden');
    }

    // Verify request data
    const { id } = req.query;
    if (!id) {
      throw new CustomError(
        HttpStatusEnum.BadReqest,
        `Invalid input: missing key 'id'`
      );
    }
    if (typeof id !== 'string') {
      throw new CustomError(HttpStatusEnum.BadReqest, `Invalid id`);
    }

    // Get old data
    const oldShortUrl = await prisma.shortUrl.findUnique({
      where: { id },
    });

    if (!oldShortUrl) {
      throw new CustomError(HttpStatusEnum.BadReqest, `No current short url`);
    }

    // Update visits
    const newVisits = (oldShortUrl.visits ?? 0) + 1;
    const updatedShortUrl = await prisma.shortUrl.update({
      where: { id },
      data: { ...oldShortUrl, visits: newVisits },
    });

    body.data = updatedShortUrl;
  } catch (error) {
    const { message, httpStatusCode } = error as CustomError;
    body = { message };
    status = httpStatusCode ?? HttpStatusEnum.InternalServerError;
  } finally {
    res.status(status).json(body);
  }
}

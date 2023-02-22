import { PrismaClient } from '@prisma/client';
import type { NextApiResponse } from 'next';
import * as ShortId from 'shortid';

import type { CreateShortUrlReq, ResBody } from '@/type/api';
import { checkReqMethod } from '@/utils/api/middlewares';

import { HttpStatusEnum } from './../../../enum/http';
import { CustomError } from './../../../type/api';

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
    if (!checkReqMethod('POST', req.method)) {
      throw new CustomError(
        HttpStatusEnum.MethodNotAllowed,
        'Method Now Allowed'
      );
    }

    // Verify request data
    const requestPreview = req.body;
    if (!requestPreview?.targetUrl) {
      throw new CustomError(
        HttpStatusEnum.BadReqest,
        `Invalid input: missing key 'targetUrl'`
      );
    }

    const { targetUrl } = requestPreview;
    // Create short url
    const id = ShortId.generate();
    await prisma.shortUrl.create({
      data: {
        ...requestPreview,
        targetUrl,
        id,
      },
    });
    body.data = { shortUrl: `${process.env.NEXT_PUBLIC_HOST}/${id}` };
  } catch (error) {
    const { message, httpStatusCode } = error as CustomError;
    body = { message };
    status = httpStatusCode ?? HttpStatusEnum.InternalServerError;
  } finally {
    res.status(status).json(body);
  }
}

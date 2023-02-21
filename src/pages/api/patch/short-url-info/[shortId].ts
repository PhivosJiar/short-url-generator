import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import { HttpStatusEnum } from '@/enum/http';
import type { Field, ResBody } from '@/type/api';
import { CustomError, ReqUrlPreviewInfo, UpdateShortUrlReq } from '@/type/api';
import { checkReqMethod } from '@/utils/api/middlewares';

const prisma = new PrismaClient();

export default async function handler(
  req: UpdateShortUrlReq,
  res: NextApiResponse<ResBody>
) {
  // Initialize response information
  let body: ResBody = { message: 'ok' };
  let status: number = HttpStatusEnum.OK;
  try {
    // Verify request method
    if (!checkReqMethod('PATCH', req.method)) {
      throw new CustomError(
        HttpStatusEnum.MethodNotAllowed,
        'Method Now Allowed'
      );
    }
    // Verify request data
    const { shortId } = req.query;
    if (!shortId) {
      throw new CustomError(
        HttpStatusEnum.BadReqest,
        `Invalid input: missing key 'shortId'`
      );
    }

    const data = req.body as ReqUrlPreviewInfo;

    // qurey short url info
    const shortUrlInfo = await prisma.shortUrl.findFirst({
      where: {
        shortId: shortId as string,
      },
    });

    // updating visits from short url info
    const updateShortUrlInfo = await prisma.shortUrl.update({
      where: {
        id: shortUrlInfo?.id,
      },
      data,
    });

    body.data = updateShortUrlInfo as Field;
  } catch (error) {
    const { message, httpStatusCode } = error as CustomError;
    body = { message };
    status = httpStatusCode ?? HttpStatusEnum.InternalServerError;
  } finally {
    res.status(status).json(body);
  }
}

import { PrismaClient } from '@prisma/client';
import type { NextApiResponse } from 'next';
import * as ShortId from 'shortid';

import {
  CreateShortUrlReq,
  CustomError,
  ReqUrlPreviewInfo,
  ResBody,
} from '@/type/api';
import { checkReqMethod } from '@/utils/api/middlewares';

import { HttpStatusEnum } from '../../enum/http';
import { formatUrl } from './../../utils/formatUrl';

const prisma = new PrismaClient();

const findOldShortUrl = async (targetUrl: string) => {
  const oldShortUrl = await prisma.shortUrl.findFirst({
    where: { targetUrl },
    orderBy: { createdAt: 'desc' },
  });
  return oldShortUrl;
};

const createShortUrl = async (
  requestPreview: ReqUrlPreviewInfo,
  formateTargetUrl: string
) => {
  const id = ShortId.generate();
  const shortUrlInfo = await prisma.shortUrl.create({
    data: {
      ...requestPreview,
      targetUrl: formateTargetUrl,
      id,
    },
  });
  return shortUrlInfo;
};

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
    const formatTargetUrl = formatUrl(targetUrl);
    // Check if the short URL already exists
    const shortUrlInfo =
      // If it exists, return the existing short URL
      (await findOldShortUrl(formatTargetUrl)) ||
      // If it does not exist, create a new short URL
      (await createShortUrl(requestPreview, formatTargetUrl));

    body.data = {
      shortUrl: `${process.env.NEXT_PUBLIC_HOST}/${shortUrlInfo.id}`,
    };
  } catch (error) {
    const { message, httpStatusCode } = error as CustomError;
    body = { message };
    status = httpStatusCode ?? HttpStatusEnum.InternalServerError;
  } finally {
    res.status(status).json(body);
  }
}

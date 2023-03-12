import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import { HttpStatusEnum } from '@/enum/http';
import { CustomError, Field, ReqUrlPreviewInfo, ResBody } from '@/type/api';

const prisma = new PrismaClient();

const getShortUrlInfo = async (id: string): Promise<Field> => {
  const shortUrlInfo = await prisma.shortUrl.findUnique({
    where: { id },
  });

  return shortUrlInfo as Field;
};

const updateShortUrlInfo = async (
  id: string,
  data: ReqUrlPreviewInfo
): Promise<Field> => {
  const updatedShortUrlInfo = await prisma.shortUrl.update({
    where: { id },
    data,
  });

  return updatedShortUrlInfo as Field;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResBody>
) {
  // Initialize response information
  let body: ResBody = { message: 'ok' };
  let status: number = HttpStatusEnum.OK;
  try {
    const { id } = req.query;

    if (!id) {
      throw new CustomError(
        HttpStatusEnum.BadReqest,
        `Invalid input: missing key 'id'`
      );
    }

    switch (req.method) {
      case 'GET': {
        // qurey short url info
        const shortUrlInfo = await getShortUrlInfo(id as string);
        body.data = shortUrlInfo;
        break;
      }
      case 'PATCH': {
        // updating visits from short url info
        const data = req.body as ReqUrlPreviewInfo;
        const updatedShortUrlInfo = await updateShortUrlInfo(
          id as string,
          data
        );
        body.data = updatedShortUrlInfo;
        break;
      }
      default:
        throw new CustomError(
          HttpStatusEnum.MethodNotAllowed,
          'Method Not Allowed'
        );
    }
  } catch (error) {
    const { message, httpStatusCode } = error as CustomError;
    body = { message };
    status = httpStatusCode ?? HttpStatusEnum.InternalServerError;
  } finally {
    res.status(status).json(body);
  }
}

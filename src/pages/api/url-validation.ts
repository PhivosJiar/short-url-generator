import axios from 'axios';
import type { NextApiResponse } from 'next';

import { CustomError, ResBody, urlValidationReq } from '@/type/api';
import { checkReqMethod } from '@/utils/api/middlewares';

import { HttpStatusEnum } from '../../enum/http';
import { formatUrl } from './../../utils/formatUrl';

export default async function handler(
  req: urlValidationReq,
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
    const { targetUrl } = req.body;
    if (!targetUrl) {
      throw new CustomError(
        HttpStatusEnum.BadReqest,
        `Invalid input: missing key 'targetUrl'`
      );
    }

    const apiUrl = formatUrl(targetUrl);
    // Use HEAD method to validate the URL's availability.
    await axios.head(apiUrl, {
      timeout: 3000,
    });
  } catch (error) {
    const { message, httpStatusCode } = error as CustomError;
    body = { message };
    status = httpStatusCode ?? HttpStatusEnum.InternalServerError;
  } finally {
    res.status(status).json(body);
  }
}

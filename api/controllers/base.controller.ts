import { ApiResponse } from '../utils/apiResponse';
import { Request, Response, NextFunction } from 'express';

export abstract class BaseController {
  protected async handleRequest(
    req: Request,
    res: Response,
    next: NextFunction,
    action: () => Promise<any>,
  ) {
    try {
      const result = await action();
      ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}

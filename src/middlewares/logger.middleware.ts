import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const reqTime = new Date().getTime();
    res.on('finish', () => {
      const { statusCode } = res;
      const resTime = new Date().getTime();

      if (statusCode === 201 || statusCode === 200) {
        this.logger.log(
          `${method} ${originalUrl} ${statusCode} - ${resTime - reqTime}ms`,
        );
      }
    });
    next();
  }
}

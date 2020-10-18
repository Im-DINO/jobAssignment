import { NextFunction, Request, Response } from "express";
import { logger } from "./winston";

class HttpException extends Error {
    status: number;
    message: string;
    constructor(status: number, message: string) {
      super(message);
      this.status = status;
      this.message = message;
    }
  }

export const errorMiddleware = (error: HttpException, request: Request, response: Response, next: NextFunction) => {
    const status = error.status || 500;
    const message = error.message || 'UnExpected Errors';
    logger.error(` STATUS [ ${status} ] | URL [${request.url}] | ERORR [ ${message} ]`);
    response
      .status(status)
      .send({
        status,
        message,
      });
}
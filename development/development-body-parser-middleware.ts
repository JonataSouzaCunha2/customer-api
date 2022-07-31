import concat from "concat-stream";
import { NextFunction, Request, RequestHandler, Response } from "express";

export const developmentBodyParserMiddleware = (): RequestHandler => (
  request: Request,
  _: Response,
  next: NextFunction,
): void => {
  request.pipe(
    concat((data: Buffer): void => {
      request.body = data;
      next();
    }),
  );
};

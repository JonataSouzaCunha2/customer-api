import { ErrorResult, ValidationErrorResult } from "../types";
import { Express, NextFunction, Request, Response } from "express";

import { HttpStatusCode } from "../../../infrastructure/http/http-status-code";
import { Middleware } from "./middleware";
import { ValidateError } from "tsoa";
import { injectable } from "inversify";

@injectable()
export class ErrorMiddleware implements Middleware {
  public configure(app: Express): void {
    app.use(
      (
        error: unknown,
        request: Request,
        response: Response<ErrorResult | ValidationErrorResult>,
        next: NextFunction,
      ): Response | void => {
        if (error instanceof ValidateError) {
          return this.handleTsoaError(error, request, response);
        }
        if (error instanceof Error) {
          if (error.message === "Unauthorized") {
            return this.handleUnauthorizedError(error, request, response);
          }
          return this.handleUnhandledError(error, request, response);
        }

        next();
      },
    );
  }

  private handleTsoaError = (error: ValidateError, _request: Request, response: Response<ValidationErrorResult>) => {
    return response.status(HttpStatusCode.BAD_REQUEST).json({
      message: "Invalid Request",
      details: error.fields,
    });
  };

  private handleUnauthorizedError(error: Error, _request: Request, response: Response<ErrorResult>) {
    return response.status(HttpStatusCode.UNAUTHORIZED).json({ message: error.message });
  }

  private handleUnhandledError(_error: Error, _request: Request, response: Response<ErrorResult>) {
    return response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
    });
  }
}

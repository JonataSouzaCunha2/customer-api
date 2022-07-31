import { Express, json, NextFunction, Request, Response } from "express";
import { injectable } from "inversify";
import { Middleware } from "./middleware";

@injectable()
export class BodyParserMiddleware implements Middleware {
  public configure(app: Express): void {
    app.use((request: Request, _: Response, next: NextFunction): void => {
      if (request.headers["content-type"] === "") {
        request.headers["content-type"] = "application/json";
      }

      next();
    });

    app.use(
      json({
        limit: "10mb",
      }),
    );
  }
}

import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { createServer, proxy, Response } from "aws-serverless-express";
import express, { NextFunction } from "express";
import { injectable, inject } from "inversify";
import { Server } from "http";
import { ErrorMiddleware } from "./middlewares/error-middleware";
import { BodyParserMiddleware } from "./middlewares/body-parser-middleware";
import { RegisterRoutes } from "./routes";
import { HttpStatusCode } from "../../infrastructure/http/http-status-code";

@injectable()
export class ProcessHttpRequest {
  private readonly bodyParserMiddleware: BodyParserMiddleware;
  private readonly errorMiddleware: ErrorMiddleware;

  constructor(
    @inject(BodyParserMiddleware) bodyParserMiddleware: BodyParserMiddleware,
    @inject(ErrorMiddleware) errorMiddleware: ErrorMiddleware,
  ) {
    this.bodyParserMiddleware = bodyParserMiddleware;
    this.errorMiddleware = errorMiddleware;
  }

  public async run(event: APIGatewayProxyEvent, context: Context): Promise<Response> {
    const app = express();
    this.bodyParserMiddleware.configure(app);
    this.configureRoutes(app);
    this.errorMiddleware.configure(app);
    const lambdaServer = createServer(app);

    return proxy(lambdaServer, event, context, "PROMISE").promise.then(
      async (result: Response) => {
        await this.beforeExit(lambdaServer);
        return result;
      },
      async (error: Error) => {
        await this.beforeExit(lambdaServer);
        return Promise.reject(error);
      },
    );
  }

  private async beforeExit(lambdaServer: Server): Promise<void> {
    lambdaServer.removeAllListeners();
    lambdaServer.close();
  }

  private configureRoutes(app: express.Express): void {
    RegisterRoutes(app);

    app.use((_request: express.Request, response: express.Response, next: NextFunction) => {
      response
        .status(HttpStatusCode.NOT_FOUND)
        .send({
          message: "Route not Found",
        })
        .end();

      next();
    });
  }
}

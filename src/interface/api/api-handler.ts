import "reflect-metadata";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { container } from "../../infrastructure/configurations/container";
import { ProcessHttpRequest } from "./process-http-request";

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> =>
  container.get(ProcessHttpRequest).run(event, context);

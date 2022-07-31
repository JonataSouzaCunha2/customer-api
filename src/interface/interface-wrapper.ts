import "reflect-metadata";

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

import { handler as apiHandler } from "../../src/interface/api/api-handler";

export const handler = async (
  event: APIGatewayProxyEvent,
  context?: Context,
): Promise<APIGatewayProxyResult | void> => {
  if (event.httpMethod !== undefined && context !== undefined) {
    return await apiHandler(event as APIGatewayProxyEvent, context);
  }

  throw new Error("Invalid event received");
};

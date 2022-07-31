import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { afterAllSystemTest, afterSystemTest, beforeSystemTest } from "./helpers/system-tests-helper";

import { HttpStatusCode } from "../../src/infrastructure/http/http-status-code";
import { dropDynamoTables } from "./helpers/database-helper";
import { handler } from "../../src/interface/api/api-handler";

interface RequestOptions {
  data?: Partial<APIGatewayProxyEvent>;
}

const generateRequestEvent = (options?: RequestOptions): APIGatewayProxyEvent =>
  ({
    httpMethod: "GET",
    path: `/customers/api/v0/health`,
    headers: {
      "content-type": "application/json",
    },
    ...options?.data,
  } as APIGatewayProxyEvent);

describe("System", () => {
  beforeEach(beforeSystemTest);
  afterEach(afterSystemTest);
  afterAll(afterAllSystemTest);

  describe("healthCheck", () => {
    it("Should return an error when the DynamoDB connection was not successfully", async () => {
      // Given
      await dropDynamoTables();

      const event = generateRequestEvent();
      const context = {} as Context;

      const expectedResult = {
        body: JSON.stringify({
          message: "Error in DynamoDB",
        }),
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      };

      // When
      const result = await handler(event, context);

      // Then
      expect(result.statusCode).toEqual(expectedResult.statusCode);
      expect(result.body).toEqual(expectedResult.body);
    });

    it("Should return a success when all service are working", async () => {
      // Given
      const event = generateRequestEvent();
      const context = {} as Context;

      const expectedResult = {
        body: JSON.stringify({
          message: "All services are working",
        }),
        statusCode: HttpStatusCode.SUCCESS,
      };

      // When
      const result = await handler(event, context);

      // Then
      expect(result.statusCode).toEqual(expectedResult.statusCode);
      expect(result.body).toEqual(expectedResult.body);
    });
  });
});

/* eslint-disable sonarjs/no-duplicate-string */
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { afterAllSystemTest, afterSystemTest, beforeSystemTest } from "./helpers/system-tests-helper";

import { Customer } from "../../src/domain/entities/customer";
import { CustomerRepository } from "../../src/infrastructure/database/repository/customer-repository";
import { HttpStatusCode } from "../../src/infrastructure/http/http-status-code";
import { container } from "../../src/infrastructure/configurations/container";
import { generateCustomer } from "../fixtures/domain/customer-fixture";
import { handler } from "../../src/interface/api/api-handler";
import { v4 } from "uuid";

interface RequestOptions {
  data?: Partial<APIGatewayProxyEvent>;
  method: string;
  endpoint: string;
  body?: object;
  queryParameters?: object;
}

type InsertDependencies = {
  customer: Customer;
};

const customerRepository = container.get(CustomerRepository);

const insertDependencies = async (dependencies: InsertDependencies) => {
  await customerRepository.insertOrUpdate(dependencies.customer);
};

const generateRequestEvent = (options: RequestOptions): APIGatewayProxyEvent =>
  ({
    httpMethod: options.method,
    path: `/customers/api/v0/${options.endpoint}`,
    headers: {
      "content-type": "application/json",
    },
    body: options.body ? JSON.stringify(options.body) : "",
    queryStringParameters: options.queryParameters,
    ...options?.data,
  } as APIGatewayProxyEvent);

describe("System", () => {
  beforeEach(beforeSystemTest);
  afterEach(afterSystemTest);
  afterAll(afterAllSystemTest);

  describe("list", () => {
    describe("when the customers exists in database", () => {
      const customer1 = generateCustomer();
      const customer2 = generateCustomer();

      beforeEach(async () => {
        await insertDependencies({ customer: customer1 });
        await insertDependencies({ customer: customer2 });
      });

      it("Should return all customers", async () => {
        // Given
        const event = generateRequestEvent({ method: "GET", endpoint: "customers" });
        const context = {} as Context;

        const expectedResult = {
          body: [customer1, customer2],
          statusCode: HttpStatusCode.SUCCESS,
        };

        // When
        const result = await handler(event, context);

        // Then
        expect(result.statusCode).toEqual(expectedResult.statusCode);
        expect(JSON.parse(result.body)).toEqual(expect.arrayContaining(expectedResult.body));
      });
    });

    describe("when the customers does not exists in database", () => {
      it("Should return an void array", async () => {
        // Given
        const event = generateRequestEvent({ method: "GET", endpoint: "customers" });
        const context = {} as Context;

        const expectedResult = {
          body: [],
          statusCode: HttpStatusCode.SUCCESS,
        };

        // When
        const result = await handler(event, context);

        // Then
        expect(result.statusCode).toEqual(expectedResult.statusCode);
        expect(JSON.parse(result.body)).toEqual(expectedResult.body);
      });
    });
  });

  describe("findById", () => {
    describe("when the customer exists in database", () => {
      const customer = generateCustomer();

      beforeEach(async () => {
        await insertDependencies({ customer });
      });

      it("Should return the customer", async () => {
        // Given
        const event = generateRequestEvent({ method: "GET", endpoint: `customers/${customer.id}` });
        const context = {} as Context;

        const expectedResult = {
          body: customer,
          statusCode: HttpStatusCode.SUCCESS,
        };

        // When
        const result = await handler(event, context);

        // Then
        expect(result.statusCode).toEqual(expectedResult.statusCode);
        expect(JSON.parse(result.body)).toEqual(expectedResult.body);
      });
    });

    describe("when the customers does not exists in database", () => {
      it("Should return error", async () => {
        // Given
        const customerId = v4();

        const event = generateRequestEvent({ method: "GET", endpoint: `customers/${customerId}` });
        const context = {} as Context;

        const expectedResult = {
          body: { message: "Customer not found" },
          statusCode: HttpStatusCode.NOT_FOUND,
        };

        // When
        const result = await handler(event, context);

        // Then
        expect(result.statusCode).toEqual(expectedResult.statusCode);
        expect(JSON.parse(result.body)).toEqual(expectedResult.body);
      });
    });
  });

  describe("search", () => {
    describe("when the freeText match with some attribute in database", () => {
      const customer = generateCustomer();

      beforeEach(async () => {
        await insertDependencies({ customer });
      });

      it("Should return the customer", async () => {
        // Given
        const freeText = customer.name;
        const event = generateRequestEvent({
          method: "GET",
          endpoint: `customersSearch`,
          queryParameters: { freeText },
        });
        const context = {} as Context;

        const expectedResult = {
          body: [customer],
          statusCode: HttpStatusCode.SUCCESS,
        };

        // When
        const result = await handler(event, context);

        // Then
        expect(result.statusCode).toEqual(expectedResult.statusCode);
        expect(JSON.parse(result.body)).toEqual(expectedResult.body);
      });
    });
  });

  describe("create", () => {
    describe("when all parameters is correct", () => {
      const customer = generateCustomer();

      it("Should create and return the customer", async () => {
        // Given
        const event = generateRequestEvent({ method: "POST", endpoint: "customers", body: customer });
        const context = {} as Context;

        const expectedResult = {
          body: {
            email: customer.email,
            age: customer.age,
            name: customer.name,
            telephone: customer.telephone,
            cpf: customer.cpf,
          },
          statusCode: HttpStatusCode.SUCCESS,
        };

        // When
        const result = await handler(event, context);

        const resultBody = JSON.parse(result.body);
        // Then
        expect(result.statusCode).toEqual(expectedResult.statusCode);
        expect(resultBody).toMatchObject(expectedResult.body);
        expect(resultBody.id).toBeDefined();
        expect(resultBody.createdAt).toBeDefined();
      });
    });

    describe("when the age is incorrect", () => {
      const customer = generateCustomer({ age: -5 });

      it("Should return error", async () => {
        // Given
        const event = generateRequestEvent({ method: "POST", endpoint: "customers", body: customer });
        const context = {} as Context;

        const expectedResult = {
          body: {
            message: "Invalid Request",
            details: {
              "customerPayload.age": {
                message: "min 0",
                value: -5,
              },
            },
          },
          statusCode: HttpStatusCode.BAD_REQUEST,
        };

        // When
        const result = await handler(event, context);

        const resultBody = JSON.parse(result.body);

        // Then
        expect(result.statusCode).toEqual(expectedResult.statusCode);
        expect(resultBody).toEqual(expectedResult.body);
      });
    });
  });

  describe("update", () => {
    describe("when the customer exists in database", () => {
      const customer = generateCustomer();

      beforeEach(async () => {
        await insertDependencies({ customer });
      });

      it("Should return the customer updated", async () => {
        // Given
        const updateCustomerName = { name: "new name" };
        const event = generateRequestEvent({
          method: "PUT",
          endpoint: `customers/${customer.id}`,
          body: updateCustomerName,
        });
        const context = {} as Context;

        const expectedResult = {
          body: { ...customer, name: updateCustomerName.name },
          statusCode: HttpStatusCode.SUCCESS,
        };

        // When
        const result = await handler(event, context);

        // Then
        expect(result.statusCode).toEqual(expectedResult.statusCode);
        expect(JSON.parse(result.body)).toEqual(expectedResult.body);
      });
    });

    describe("when the customers does not exists in database", () => {
      it("Should return error", async () => {
        // Given
        const customerId = v4();

        const event = generateRequestEvent({ method: "PUT", endpoint: `customers/${customerId}` });
        const context = {} as Context;

        const expectedResult = {
          body: { message: "Customer not found" },
          statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        };

        // When
        const result = await handler(event, context);

        // Then
        expect(result.statusCode).toEqual(expectedResult.statusCode);
        expect(JSON.parse(result.body)).toEqual(expectedResult.body);
      });
    });
  });

  describe("delete", () => {
    describe("when the customer exists in database", () => {
      const customer = generateCustomer();

      beforeEach(async () => {
        await insertDependencies({ customer });
      });

      it("Should return success", async () => {
        // Given
        const event = generateRequestEvent({
          method: "DELETE",
          endpoint: `customers/${customer.id}`,
        });
        const context = {} as Context;

        const expectedResult = {
          body: "Register deleted with success",
          statusCode: HttpStatusCode.SUCCESS,
        };

        // When
        const result = await handler(event, context);

        // Then
        expect(result.statusCode).toEqual(expectedResult.statusCode);
        expect(JSON.parse(result.body)).toEqual(expectedResult.body);
      });
    });

    describe("when the customers does not exists in database", () => {
      it("Should return error", async () => {
        // Given
        const customerId = v4();

        const event = generateRequestEvent({ method: "DELETE", endpoint: `customers/${customerId}` });
        const context = {} as Context;

        const expectedResult = {
          body: { message: "Customer not found" },
          statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        };

        // When
        const result = await handler(event, context);

        // Then
        expect(result.statusCode).toEqual(expectedResult.statusCode);
        expect(JSON.parse(result.body)).toEqual(expectedResult.body);
      });
    });
  });
});

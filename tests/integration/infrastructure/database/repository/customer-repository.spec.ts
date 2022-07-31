import { createDynamoTable, dropDynamoTables, restartOriginalTable } from "../../../../system/helpers/database-helper";

import { Customer } from "../../../../../src/domain/entities/customer";
import { CustomerRepository } from "../../../../../src/infrastructure/database/repository/customer-repository";
import { ResultNotFound } from "../../../../../src/application/contracts/result/result-not-found";
import { ResultSuccess } from "../../../../../src/application/contracts/result/result-success";
import { container } from "../../../../../src/infrastructure/configurations/container";
import { generateCustomer } from "../../../../fixtures/domain/customer-fixture";

type InsertDependencies = {
  customer: Customer;
};

const customerRepository = container.get(CustomerRepository);

const insertDependencies = async (dependencies: InsertDependencies) => {
  await customerRepository.insertOrUpdate(dependencies.customer);
};

describe("Integration", () => {
  describe("CustomerRepository", () => {
    beforeEach(async () => await createDynamoTable());
    afterEach(async () => await dropDynamoTables());
    afterAll(() => restartOriginalTable());

    describe("FindByCustomerId", () => {
      it("Should return a customer", async () => {
        // Given
        const customer = generateCustomer();
        await insertDependencies({ customer });

        const expectedResult = new ResultSuccess({
          age: customer.age,
          cpf: customer.cpf,
          createdAt: customer.createdAt,
          email: customer.email,
          id: customer.id,
          name: customer.name,
          telephone: customer.telephone,
        });

        // When
        const result = await customerRepository.findByCustomerId(customer.id);

        // Then
        expect(result).toEqual(expectedResult);
      });

      it("Should return a ResultNotFound if no customer was found", async () => {
        // Given
        const customer = new Customer(generateCustomer());

        const expectedResult = new ResultNotFound("Customer not found");

        // When
        const result = await customerRepository.findByCustomerId(customer.id);

        // Then
        expect(result).toEqual(expectedResult);
      });
    });

    describe("List", () => {
      it("Should return an customerList", async () => {
        // Given
        const customer1 = generateCustomer();
        const customer2 = generateCustomer();

        await insertDependencies({ customer: customer1 });
        await insertDependencies({ customer: customer2 });

        const expectedResult = [customer1, customer2];

        // When
        const result = (await customerRepository.list()) as ResultSuccess<Customer[]>;

        // Then
        expect(result.data).toEqual(expect.arrayContaining(expectedResult));
      });

      it("Should return an void array if no customer was found", async () => {
        // When
        const result = await customerRepository.list();

        const expectedResult = new ResultSuccess([]);

        // Then
        expect(result).toEqual(expectedResult);
      });
    });

    describe("FindByFreeText", () => {
      describe("When the free text match with some customer attribute", () => {
        it("Should return an customerList", async () => {
          // Given
          const freeText = "abc";
          const customer1 = generateCustomer({ name: freeText });
          const customer2 = generateCustomer({ name: freeText });

          await insertDependencies({ customer: customer1 });
          await insertDependencies({ customer: customer2 });

          const expectedResult = [customer1, customer2];

          // When
          const result = (await customerRepository.findByFreeText(freeText)) as ResultSuccess<Customer[]>;

          // Then
          expect(result.data).toEqual(expect.arrayContaining(expectedResult));
        });
      });

      describe("When the free text not match with some customer attribute", () => {
        it("Should return an void array", async () => {
          // Given
          const freeText = "this text is different";
          const customer1 = generateCustomer();
          const customer2 = generateCustomer();

          await insertDependencies({ customer: customer1 });
          await insertDependencies({ customer: customer2 });

          const expectedResult = new ResultSuccess([]);

          // When
          const result = await customerRepository.findByFreeText(freeText);

          // Then
          expect(result).toEqual(expectedResult);
        });
      });
    });

    describe("InsertOrUpdate", () => {
      describe("When the customer doesnt exists", () => {
        it("Should insert and return the created customer", async () => {
          // Given
          const customer = new Customer(generateCustomer());

          const expectedResult = new ResultSuccess({
            age: customer.age,
            cpf: customer.cpf,
            createdAt: customer.createdAt,
            email: customer.email,
            id: customer.id,
            name: customer.name,
            telephone: customer.telephone,
          });

          // When
          const result = await customerRepository.insertOrUpdate(customer);

          // Then
          expect(result).toEqual(expectedResult);
        });
      });

      describe("When the customer already exists", () => {
        // Given
        const existentCustomer = new Customer(generateCustomer());

        beforeAll(async () => {
          await insertDependencies({ customer: existentCustomer });
        });

        it("Should update and return the updated customer", async () => {
          const updatedCustomer = { ...existentCustomer, name: "new name" };

          const expectedResult = new ResultSuccess({
            age: existentCustomer.age,
            cpf: existentCustomer.cpf,
            createdAt: existentCustomer.createdAt,
            email: existentCustomer.email,
            id: existentCustomer.id,
            name: updatedCustomer.name,
            telephone: existentCustomer.telephone,
          });

          // When
          const result = await customerRepository.insertOrUpdate(updatedCustomer);

          // Then
          expect(result).toEqual(expectedResult);
        });
      });
    });

    describe("Delete", () => {
      it("Should return success when the register is deleted", async () => {
        // Given
        const customer = generateCustomer();
        await insertDependencies({ customer });

        const expectedResult = new ResultSuccess("Register deleted with success");

        // When
        const result = await customerRepository.delete(customer);

        // Then
        expect(result).toEqual(expectedResult);
      });
    });
  });
});

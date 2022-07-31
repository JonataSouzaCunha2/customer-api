import { Customer } from "../../../../../src/domain/entities/customer";
import { CustomerCollection } from "../../../../../src/infrastructure/database/collection/customer-collection";
import { CustomerItem } from "../../../../../src/infrastructure/database/item/customer-item";
import { generateCustomer } from "../../../../fixtures/domain/customer-fixture";
import { generateCustomerItem } from "../../../../fixtures/infrastructure/database/customer-fixture";

describe("Unit", () => {
  describe("Infrastructure", () => {
    describe("Database", () => {
      describe("Collection", () => {
        describe("CustomerCollection", () => {
          describe("FromDomain", () => {
            it("Should successfully transform into a customer collection", () => {
              // Given
              const customer = generateCustomer();

              const expectedResult = new CustomerCollection({
                customerItem: new CustomerItem({
                  pk: `${CustomerItem.CUSTOMER_PK}#${customer.id}`,
                  sk: `${CustomerItem.CUSTOMER_SK}#${customer.cpf}`,
                  age: customer.age,
                  cpf: customer.cpf,
                  createdAt: customer.createdAt,
                  email: customer.email,
                  id: customer.id,
                  name: customer.name,
                  telephone: customer.telephone,
                }),
              });

              // When
              const result = CustomerCollection.fromDomain(customer);

              // Then
              expect(expectedResult).toStrictEqual(result);
            });
          });

          describe("FromDynamoCollection", () => {
            it("Should successfully transform into a customer collection", () => {
              // Given
              const dynamoCustomerItem = generateCustomerItem();

              const expectedResult = new CustomerCollection({
                customerItem: new CustomerItem({
                  pk: dynamoCustomerItem.pk,
                  sk: dynamoCustomerItem.sk,
                  age: dynamoCustomerItem.age,
                  cpf: dynamoCustomerItem.cpf,
                  createdAt: dynamoCustomerItem.createdAt,
                  email: dynamoCustomerItem.email,
                  id: dynamoCustomerItem.id,
                  name: dynamoCustomerItem.name,
                  telephone: dynamoCustomerItem.telephone,
                }),
              });

              // When
              const result = CustomerCollection.fromDynamoCollection([dynamoCustomerItem]);

              // Then
              expect(expectedResult).toStrictEqual(result);
            });
          });

          describe("IsCustomerItem", () => {
            it("Should return true when pk starts with CUSTOMER", () => {
              // Given
              const dynamoCustomerItem = generateCustomerItem();

              const expectedResult = true;

              // When
              const result = CustomerCollection.isCustomerItem(dynamoCustomerItem);

              // Then
              expect(expectedResult).toEqual(result);
            });

            it("Should return false when pk does not start with CUSTOMER", () => {
              // Given
              const dynamoCustomerItem = generateCustomerItem({ pk: "TEST" });

              const expectedResult = false;

              // When
              const result = CustomerCollection.isCustomerItem(dynamoCustomerItem);

              // Then
              expect(expectedResult).toEqual(result);
            });
          });

          describe("ToDomain", () => {
            it("Should successfully transform the customer collection into a domain object", () => {
              // Given
              const dynamoCustomerItem = generateCustomerItem();

              const customerCollection = new CustomerCollection({
                customerItem: new CustomerItem(dynamoCustomerItem),
              });

              const expectedResult = new Customer({
                age: dynamoCustomerItem.age,
                cpf: dynamoCustomerItem.cpf,
                createdAt: dynamoCustomerItem.createdAt,
                email: dynamoCustomerItem.email,
                id: dynamoCustomerItem.id,
                name: dynamoCustomerItem.name,
                telephone: dynamoCustomerItem.telephone,
              });

              // When
              const result = customerCollection.toDomain();

              // Then
              expect(expectedResult).toStrictEqual(result);
            });
          });
        });
      });
    });
  });
});

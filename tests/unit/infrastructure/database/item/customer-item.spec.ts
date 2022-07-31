import { Customer } from "../../../../../src/domain/entities/customer";
import { CustomerItem } from "../../../../../src/infrastructure/database/item/customer-item";
import { generateCustomer } from "../../../../fixtures/domain/customer-fixture";
import { generateCustomerItem } from "../../../../fixtures/infrastructure/database/customer-fixture";

describe("Unit", () => {
  describe("Infrastructure", () => {
    describe("Database", () => {
      describe("Item", () => {
        describe("CustomerItem", () => {
          describe("FromDomain", () => {
            it("Should successfully transform into customer item", () => {
              // Given
              const customer = generateCustomer();

              const expectedResult = new CustomerItem({
                pk: `${CustomerItem.CUSTOMER_PK}#${customer.id}`,
                sk: `${CustomerItem.CUSTOMER_SK}#${customer.cpf}`,
                age: customer.age,
                cpf: customer.cpf,
                createdAt: customer.createdAt,
                email: customer.email,
                id: customer.id,
                name: customer.name,
                telephone: customer.telephone,
              });

              // When
              const result = CustomerItem.fromDomain(customer);

              // Then
              expect(expectedResult).toStrictEqual(result);
            });
          });

          describe("FromDynamoItem", () => {
            it("Should successfully transform into customer item", () => {
              // Given
              const dynamoCustomerItem = generateCustomerItem();

              const expectedResult = new CustomerItem({
                pk: dynamoCustomerItem.pk,
                sk: dynamoCustomerItem.sk,
                age: dynamoCustomerItem.age,
                cpf: dynamoCustomerItem.cpf,
                createdAt: dynamoCustomerItem.createdAt,
                email: dynamoCustomerItem.email,
                id: dynamoCustomerItem.id,
                name: dynamoCustomerItem.name,
                telephone: dynamoCustomerItem.telephone,
              });

              // When
              const result = CustomerItem.fromDynamoItem(dynamoCustomerItem);

              // Then
              expect(expectedResult).toStrictEqual(result);
            });
          });

          describe("ToDomain", () => {
            it("Should successfully transform the customer item into a domain object", () => {
              // Given
              const customerItem = new CustomerItem(generateCustomerItem());

              const expectedResult = new Customer({
                age: customerItem.age,
                cpf: customerItem.cpf,
                createdAt: customerItem.createdAt,
                email: customerItem.email,
                id: customerItem.id,
                name: customerItem.name,
                telephone: customerItem.telephone,
              });

              // When
              const result = customerItem.toDomain();

              // Then
              expect(expectedResult).toStrictEqual(result);
            });
          });
        });
      });
    });
  });
});

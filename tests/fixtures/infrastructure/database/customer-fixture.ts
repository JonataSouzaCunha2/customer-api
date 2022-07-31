import { CustomerItem } from "../../../../src/infrastructure/database/item/customer-item";
import { NonFunctionProperties } from "../../../../src/application/contracts/types";
import faker from "faker";

export const generateCustomerItem = (data: Partial<CustomerItem> = {}): NonFunctionProperties<CustomerItem> => ({
  pk: `${CustomerItem.CUSTOMER_PK}#${faker.random.uuid()}`,
  sk: `${CustomerItem.CUSTOMER_SK}#${faker.random.number()}`,
  email: faker.internet.email(),
  age: faker.random.number({ max: 100, min: 1 }),
  name: faker.random.word(),
  telephone: faker.random.number({ min: 500 }).toString(),
  createdAt: faker.date.past().toISOString(),
  cpf: faker.random.number({ min: 500 }).toString(),
  id: faker.random.uuid(),
  ...data,
});

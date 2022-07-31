import { Customer } from "../../../src/domain/entities/customer";
import { NonFunctionProperties } from "../../../src/application/contracts/types";
import faker from "faker";

export const generateCustomer = (data: Partial<Customer> = {}): NonFunctionProperties<Customer> => ({
  email: faker.internet.email(),
  age: faker.random.number({ max: 100, min: 1 }),
  name: faker.random.word(),
  telephone: faker.random.number({ min: 500 }).toString(),
  createdAt: faker.date.past().toISOString(),
  cpf: faker.random.number({ min: 500 }).toString(),
  id: faker.random.uuid(),
  ...data,
});

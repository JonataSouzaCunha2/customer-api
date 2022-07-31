import { CommandHandler } from "../../../contracts/command-handler";
import { CreateCustomerCommand } from "./create-customer-command";
import { Customer } from "../../../../domain/entities/customer";
import { Result } from "../../../contracts/result/result";
import { inject, injectable } from "inversify";
import { CustomerRepository } from "../../../../infrastructure/database/repository/customer-repository";
import { v4 } from "uuid";

@injectable()
export class CreateCustomerHandler implements CommandHandler<CreateCustomerCommand, Customer> {
  private readonly customerRepository: CustomerRepository;

  constructor(@inject(CustomerRepository) customerRepository: CustomerRepository) {
    this.customerRepository = customerRepository;
  }

  public async handle(parameters: CreateCustomerCommand): Promise<Result<Customer>> {
    const customer = new Customer({
      ...parameters,
      createdAt: new Date().toISOString(),
      id: v4(),
    });

    return this.customerRepository.insertOrUpdate(customer);
  }
}

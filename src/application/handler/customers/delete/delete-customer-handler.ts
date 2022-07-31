import { CommandHandler } from "../../../contracts/command-handler";
import { Result } from "../../../contracts/result/result";
import { inject, injectable } from "inversify";
import { CustomerRepository } from "../../../../infrastructure/database/repository/customer-repository";
import { Customer } from "../../../../domain/entities/customer";

@injectable()
export class DeleteCustomerHandler implements CommandHandler<Customer, string> {
  private readonly customerRepository: CustomerRepository;

  constructor(@inject(CustomerRepository) customerRepository: CustomerRepository) {
    this.customerRepository = customerRepository;
  }

  public async handle(customer: Customer): Promise<Result<string>> {
    return this.customerRepository.delete(customer);
  }
}

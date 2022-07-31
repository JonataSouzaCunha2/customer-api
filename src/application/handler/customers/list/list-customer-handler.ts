import { CommandHandler } from "../../../contracts/command-handler";
import { Customer } from "../../../../domain/entities/customer";
import { Result } from "../../../contracts/result/result";
import { inject, injectable } from "inversify";
import { CustomerRepository } from "../../../../infrastructure/database/repository/customer-repository";

@injectable()
export class ListCustomerHandler implements CommandHandler<void, Customer[]> {
  private readonly customerRepository: CustomerRepository;

  constructor(@inject(CustomerRepository) customerRepository: CustomerRepository) {
    this.customerRepository = customerRepository;
  }

  public async handle(): Promise<Result<Customer[]>> {
    return this.customerRepository.list();
  }
}

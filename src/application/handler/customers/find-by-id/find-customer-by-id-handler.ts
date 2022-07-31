import { CommandHandler } from "../../../contracts/command-handler";
import { FindCustomerByIdCommand } from "./find-customer-by-id-command";
import { Customer } from "../../../../domain/entities/customer";
import { Result } from "../../../contracts/result/result";
import { inject, injectable } from "inversify";
import { CustomerRepository } from "../../../../infrastructure/database/repository/customer-repository";

@injectable()
export class FindCustomerByIdHandler implements CommandHandler<FindCustomerByIdCommand, Customer> {
  private readonly customerRepository: CustomerRepository;

  constructor(@inject(CustomerRepository) customerRepository: CustomerRepository) {
    this.customerRepository = customerRepository;
  }

  public async handle(parameters: FindCustomerByIdCommand): Promise<Result<Customer>> {
    return this.customerRepository.findByCustomerId(parameters.customerId);
  }
}

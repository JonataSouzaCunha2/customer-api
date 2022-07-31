import { CommandHandler } from "../../../contracts/command-handler";
import { SearchCustomerCommand } from "./search-customer-command";
import { Customer } from "../../../../domain/entities/customer";
import { Result } from "../../../contracts/result/result";
import { inject, injectable } from "inversify";
import { CustomerRepository } from "../../../../infrastructure/database/repository/customer-repository";

@injectable()
export class SearchCustomerHandler implements CommandHandler<SearchCustomerCommand, Customer[]> {
  private readonly customerRepository: CustomerRepository;

  constructor(@inject(CustomerRepository) customerRepository: CustomerRepository) {
    this.customerRepository = customerRepository;
  }

  public async handle(parameters: SearchCustomerCommand): Promise<Result<Customer[]>> {
    return this.customerRepository.findByFreeText(parameters.freeText);
  }
}

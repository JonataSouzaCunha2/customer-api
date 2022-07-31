import { inject, injectable } from "inversify";
import { Customer } from "../../../../domain/entities/customer";
import { CustomerRepository } from "../../../../infrastructure/database/repository/customer-repository";
import { Result } from "../../../contracts/result/result";
import { ResultError } from "../../../contracts/result/result-error";
import { UseCase } from "../../../contracts/use-case";
import { UpdateCustomerHandler } from "../../../handler/customers/update/update-customer-handler";
import { UpdateCustomerParameters } from "./update-customer-parameters";

@injectable()
export class UpdateCustomerUseCase implements UseCase {
  private readonly updateCustomerHandler: UpdateCustomerHandler;
  private readonly customerRepository: CustomerRepository;

  constructor(
    @inject(UpdateCustomerHandler) updateCustomerHandler: UpdateCustomerHandler,
    @inject(CustomerRepository) customerRepository: CustomerRepository,
  ) {
    this.updateCustomerHandler = updateCustomerHandler;
    this.customerRepository = customerRepository;
  }

  public async execute(parameters: UpdateCustomerParameters): Promise<Result<Customer>> {
    const customerResult = await this.customerRepository.findByCustomerId(parameters.customerId);

    if (customerResult.isError) {
      return new ResultError("Customer not found");
    }

    const updatedCustomer = new Customer({ ...customerResult.data, ...parameters });

    return this.updateCustomerHandler.handle(updatedCustomer);
  }
}

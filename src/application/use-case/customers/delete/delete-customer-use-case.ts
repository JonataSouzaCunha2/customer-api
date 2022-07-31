import { inject, injectable } from "inversify";
import { CustomerRepository } from "../../../../infrastructure/database/repository/customer-repository";
import { Result } from "../../../contracts/result/result";
import { ResultError } from "../../../contracts/result/result-error";
import { UseCase } from "../../../contracts/use-case";
import { DeleteCustomerHandler } from "../../../handler/customers/delete/delete-customer-handler";
import { DeleteCustomerParameters } from "./delete-customer-parameters";

@injectable()
export class DeleteCustomerUseCase implements UseCase {
  private readonly deleteCustomerHandler: DeleteCustomerHandler;
  private readonly customerRepository: CustomerRepository;

  constructor(
    @inject(DeleteCustomerHandler) deleteCustomerHandler: DeleteCustomerHandler,
    @inject(CustomerRepository) customerRepository: CustomerRepository,
  ) {
    this.deleteCustomerHandler = deleteCustomerHandler;
    this.customerRepository = customerRepository;
  }

  public async execute(parameters: DeleteCustomerParameters): Promise<Result<string>> {
    const customerResult = await this.customerRepository.findByCustomerId(parameters.customerId);

    if (customerResult.isError) {
      return new ResultError("Customer not found");
    }

    return this.deleteCustomerHandler.handle(customerResult.data);
  }
}

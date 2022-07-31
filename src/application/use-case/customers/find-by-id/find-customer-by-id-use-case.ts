import { inject, injectable } from "inversify";
import { Customer } from "../../../../domain/entities/customer";
import { Result } from "../../../contracts/result/result";
import { UseCase } from "../../../contracts/use-case";
import { FindCustomerByIdCommand } from "../../../handler/customers/find-by-id/find-customer-by-id-command";
import { FindCustomerByIdHandler } from "../../../handler/customers/find-by-id/find-customer-by-id-handler";
import { FindCustomerByIdParameters } from "./find-customer-by-id-parameters";

@injectable()
export class FindCustomerByIdUseCase implements UseCase {
  private readonly findCustomerByIdHandler: FindCustomerByIdHandler;

  constructor(@inject(FindCustomerByIdHandler) findCustomerByIdHandler: FindCustomerByIdHandler) {
    this.findCustomerByIdHandler = findCustomerByIdHandler;
  }

  public async execute(parameters: FindCustomerByIdParameters): Promise<Result<Customer>> {
    return this.findCustomerByIdHandler.handle(new FindCustomerByIdCommand(parameters));
  }
}

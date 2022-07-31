import { inject, injectable } from "inversify";
import { Customer } from "../../../../domain/entities/customer";
import { Result } from "../../../contracts/result/result";
import { UseCase } from "../../../contracts/use-case";
import { CreateCustomerCommand } from "../../../handler/customers/create/create-customer-command";
import { CreateCustomerHandler } from "../../../handler/customers/create/create-customer-handler";

import { CreateCustomerParameters } from "./create-customer-parameters";

@injectable()
export class CreateCustomerUseCase implements UseCase {
  private readonly createCustomerHandler: CreateCustomerHandler;

  constructor(@inject(CreateCustomerHandler) createCustomerHandler: CreateCustomerHandler) {
    this.createCustomerHandler = createCustomerHandler;
  }

  public async execute(parameters: CreateCustomerParameters): Promise<Result<Customer>> {
    return this.createCustomerHandler.handle(new CreateCustomerCommand(parameters));
  }
}

import { inject, injectable } from "inversify";
import { Customer } from "../../../../domain/entities/customer";
import { Result } from "../../../contracts/result/result";
import { UseCase } from "../../../contracts/use-case";
import { ListCustomerHandler } from "../../../handler/customers/list/list-customer-handler";

@injectable()
export class ListCustomerUseCase implements UseCase {
  private readonly listCustomerHandler: ListCustomerHandler;

  constructor(@inject(ListCustomerHandler) listCustomerHandler: ListCustomerHandler) {
    this.listCustomerHandler = listCustomerHandler;
  }

  public async execute(): Promise<Result<Customer[]>> {
    return this.listCustomerHandler.handle();
  }
}

import { inject, injectable } from "inversify";
import { Customer } from "../../../../domain/entities/customer";
import { Result } from "../../../contracts/result/result";
import { ResultError } from "../../../contracts/result/result-error";
import { UseCase } from "../../../contracts/use-case";
import { SearchCustomerCommand } from "../../../handler/customers/search/search-customer-command";
import { SearchCustomerHandler } from "../../../handler/customers/search/search-customer-handler";
import { isNullOrUndefined } from "../../../helpers/is-null-or-undefined";
import { SearchCustomerParameters } from "./search-customer-parameters";

@injectable()
export class SearchCustomerUseCase implements UseCase {
  private readonly searchCustomerHandler: SearchCustomerHandler;

  constructor(@inject(SearchCustomerHandler) searchCustomerHandler: SearchCustomerHandler) {
    this.searchCustomerHandler = searchCustomerHandler;
  }

  public async execute(parameters: SearchCustomerParameters): Promise<Result<Customer[]>> {
    if (isNullOrUndefined(parameters.freeText)) {
      return new ResultError("the freeText is an query param required");
    }

    return this.searchCustomerHandler.handle(new SearchCustomerCommand({ freeText: parameters.freeText }));
  }
}

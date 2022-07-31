import { NonFunctionProperties } from "../../../contracts/types";

export class FindCustomerByIdCommand {
  public readonly customerId: string;

  constructor(data: NonFunctionProperties<FindCustomerByIdCommand>) {
    this.customerId = data.customerId;
  }
}

import { NonFunctionProperties } from "../../../contracts/types";

export class SearchCustomerCommand {
  public readonly freeText: string;

  constructor(data: NonFunctionProperties<SearchCustomerCommand>) {
    this.freeText = data.freeText;
  }
}

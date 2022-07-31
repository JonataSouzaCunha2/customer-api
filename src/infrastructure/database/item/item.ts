import { NonFunctionProperties } from "../../../application/contracts/types";

export abstract class Item {
  public readonly pk: string;
  public readonly sk: string;

  constructor(data: NonFunctionProperties<Item>) {
    this.pk = data.pk;
    this.sk = data.sk;
  }

  public abstract toDomain(): void;
}

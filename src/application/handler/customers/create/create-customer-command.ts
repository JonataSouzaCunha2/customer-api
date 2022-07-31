import { NonFunctionProperties } from "../../../contracts/types";

export class CreateCustomerCommand {
  public readonly name: string;
  public readonly telephone: string;
  public readonly email: string;
  public readonly cpf: string;
  public readonly age: number;

  constructor(data: NonFunctionProperties<CreateCustomerCommand>) {
    this.name = data.name;
    this.telephone = data.telephone;
    this.email = data.email;
    this.cpf = data.cpf;
    this.age = data.age;
  }
}

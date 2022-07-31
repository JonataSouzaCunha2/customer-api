import { NonFunctionProperties } from "../../application/contracts/types";

export class Customer {
  public readonly name: string;
  public readonly createdAt: string;
  public readonly telephone: string;
  public readonly email: string;
  public readonly cpf: string;
  public readonly age: number;
  public readonly id: string;

  constructor(data: NonFunctionProperties<Customer>) {
    this.name = data.name;
    this.createdAt = data.createdAt;
    this.telephone = data.telephone;
    this.email = data.email;
    this.cpf = data.cpf;
    this.age = data.age;
    this.id = data.id;
  }
}

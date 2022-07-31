import { Customer } from "../../../domain/entities/customer";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Item } from "./item";
import { NonFunctionProperties } from "../../../application/contracts/types";

export class CustomerItem extends Item {
  public static readonly CUSTOMER_PK = "CUSTOMER";
  public static readonly CUSTOMER_SK = "CUSTOMER";

  public readonly name: string;
  public readonly createdAt: string;
  public readonly telephone: string;
  public readonly email: string;
  public readonly cpf: string;
  public readonly age: number;
  public readonly id: string;

  constructor(data: NonFunctionProperties<CustomerItem>) {
    super(data);

    this.name = data.name;
    this.createdAt = data.createdAt;
    this.telephone = data.telephone;
    this.email = data.email;
    this.cpf = data.cpf;
    this.age = data.age;
    this.id = data.id;
  }

  static fromDomain(customer: Customer): CustomerItem {
    const pk = `${this.CUSTOMER_PK}#${customer.id}`;
    const sk = `${this.CUSTOMER_PK}#${customer.cpf}`;

    return new CustomerItem({
      pk,
      sk,
      name: customer.name,
      createdAt: customer.createdAt,
      telephone: customer.telephone,
      email: customer.email,
      cpf: customer.cpf,
      age: customer.age,
      id: customer.id,
    });
  }

  static fromDynamoItem(dynamoItem: DocumentClient.AttributeMap): CustomerItem {
    return new CustomerItem({
      pk: dynamoItem.pk,
      sk: dynamoItem.sk,
      name: dynamoItem.name,
      createdAt: dynamoItem.createdAt,
      telephone: dynamoItem.telephone,
      email: dynamoItem.email,
      cpf: dynamoItem.cpf,
      age: dynamoItem.age,
      id: dynamoItem.id,
    });
  }

  public toDomain(): Customer {
    return new Customer({
      name: this.name,
      createdAt: this.createdAt,
      telephone: this.telephone,
      email: this.email,
      cpf: this.cpf,
      age: this.age,
      id: this.id,
    });
  }
}

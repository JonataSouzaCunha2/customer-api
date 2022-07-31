import { Customer } from "../../../domain/entities/customer";
import { CustomerItem } from "../item/customer-item";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { NonFunctionProperties } from "../../../application/contracts/types";

export class CustomerCollection {
  public readonly customerItem: CustomerItem;

  constructor(data: NonFunctionProperties<CustomerCollection>) {
    this.customerItem = data.customerItem;
  }

  static fromDomain(customer: Customer): CustomerCollection {
    return new CustomerCollection({
      customerItem: CustomerItem.fromDomain(customer),
    });
  }

  static fromDynamoCollection(dynamoItems: DocumentClient.ItemList): CustomerCollection {
    const dynamoCustomerItem = dynamoItems.find((item) => this.isCustomerItem(item));

    return new CustomerCollection({
      customerItem: CustomerItem.fromDynamoItem(dynamoCustomerItem ?? []),
    });
  }

  static isCustomerItem(item: DocumentClient.AttributeMap): boolean {
    return item.pk.startsWith(CustomerItem.CUSTOMER_PK);
  }

  public toDomain(): Customer {
    return new Customer({
      ...this.customerItem.toDomain(),
    });
  }
}

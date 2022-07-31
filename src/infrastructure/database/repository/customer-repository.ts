import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { inject, injectable } from "inversify";
import { isNullOrUndefined } from "../../../application/helpers/is-null-or-undefined";
import { Result } from "../../../application/contracts/result/result";
import { ResultError } from "../../../application/contracts/result/result-error";
import { ResultNotFound } from "../../../application/contracts/result/result-not-found";
import { ResultSuccess } from "../../../application/contracts/result/result-success";
import { Settings } from "../../configurations/settings";
import { Customer } from "../../../domain/entities/customer";
import { CustomerCollection } from "../collection/customer-collection";
import { CustomerItem } from "../item/customer-item";

@injectable()
export class CustomerRepository {
  private readonly documentClient: DocumentClient;
  private readonly settings: Settings;

  constructor(@inject(DocumentClient) documentClient: DocumentClient, @inject(Settings) settings: Settings) {
    this.documentClient = documentClient;
    this.settings = settings;
  }

  public async findByCustomerId(customerId: string): Promise<Result<Customer>> {
    const params = {
      ExpressionAttributeValues: {
        ":pk": `${CustomerItem.CUSTOMER_PK}#${customerId}`,
      },
      KeyConditionExpression: "pk = :pk",
      TableName: this.settings.dynamodbTable,
    };

    try {
      const result = await this.documentClient.query(params).promise();

      if (isNullOrUndefined(result.Items) || result.Items.length === 0) {
        return new ResultNotFound("Customer not found");
      }

      const customerCollection = CustomerCollection.fromDynamoCollection(result.Items);

      const customer = customerCollection.toDomain();

      return new ResultSuccess(customer);
    } catch (error) {
      return new ResultError("Error when find customer");
    }
  }

  public async list(): Promise<Result<Customer[]>> {
    const params = {
      TableName: this.settings.dynamodbTable,
    };

    try {
      const result = await this.documentClient.scan(params).promise();

      if (isNullOrUndefined(result.Items) || result.Items.length === 0) {
        return new ResultSuccess([]);
      }

      const customerCollections = result.Items.map((item) => CustomerCollection.fromDynamoCollection([item]));
      const customers = customerCollections.map((customerCollection) => customerCollection.toDomain());

      return new ResultSuccess(customers);
    } catch (error) {
      return new ResultError("Error when list customers");
    }
  }

  public async findByFreeText(freeText: string): Promise<Result<Customer[]>> {
    const params = {
      FilterExpression: "#name = :ft or #phone = :ft or #email = :ft or #cpf = :ft or #age = :ft or #createdAt = :ft",
      ExpressionAttributeNames: {
        "#name": "name",
        "#phone": "telephone",
        "#email": "email",
        "#cpf": "cpf",
        "#age": "age",
        "#createdAt": "createdAt",
      },
      ExpressionAttributeValues: {
        ":ft": freeText,
      },
      TableName: this.settings.dynamodbTable,
    };

    try {
      const result = await this.documentClient.scan(params).promise();

      if (isNullOrUndefined(result.Items) || result.Items.length === 0) {
        return new ResultSuccess([]);
      }

      const customerCollections = result.Items.map((item) => CustomerCollection.fromDynamoCollection([item]));
      const customers = customerCollections.map((customerCollection) => customerCollection.toDomain());

      return new ResultSuccess(customers);
    } catch (error) {
      return new ResultError("Error when find customer by free text");
    }
  }

  public async insertOrUpdate(customer: Customer): Promise<Result<Customer>> {
    try {
      const customerCollection = CustomerCollection.fromDomain(customer);

      await this.insertOrUpdateCustomerItem(customerCollection.customerItem);

      return this.findByCustomerId(customer.id);
    } catch (error) {
      return new ResultError("Error when entering new items in the customer");
    }
  }

  public async delete(customer: Customer): Promise<Result<string>> {
    try {
      const params = {
        Key: {
          pk: `${CustomerItem.CUSTOMER_PK}#${customer.id}`,
          sk: `${CustomerItem.CUSTOMER_SK}#${customer.cpf}`,
        },
        TableName: this.settings.dynamodbTable,
      };

      await this.documentClient.delete(params).promise();

      return new ResultSuccess("Register deleted with success");
    } catch (error) {
      return new ResultError("Error when delete item in the customer");
    }
  }

  private async insertOrUpdateCustomerItem(customerItem: CustomerItem) {
    const params = {
      Item: customerItem,
      TableName: this.settings.dynamodbTable,
    };

    return await this.documentClient.put(params).promise();
  }
}

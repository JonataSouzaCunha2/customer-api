import DynamoDB from "aws-sdk/clients/dynamodb";
import { inject, injectable } from "inversify";
import { Result } from "../../../application/contracts/result/result";
import { ResultError } from "../../../application/contracts/result/result-error";
import { ResultSuccess } from "../../../application/contracts/result/result-success";
import { Settings } from "../../configurations/settings";

@injectable()
export class DynamoRepository {
  private readonly dynamoDb: DynamoDB;
  private readonly settings!: Settings;

  constructor(@inject(Settings) settings: Settings) {
    this.settings = settings;
    this.dynamoDb = new DynamoDB({
      endpoint: this.settings.dynamodbEndpoint,
    });
  }

  public async scan(limit: number): Promise<Result<DynamoDB.ScanOutput>> {
    try {
      const result = await this.dynamoDb.scan({ Limit: limit, TableName: this.settings.dynamodbTable }).promise();

      return new ResultSuccess(result);
    } catch (error) {
      return new ResultError("Failed to scan table");
    }
  }
}

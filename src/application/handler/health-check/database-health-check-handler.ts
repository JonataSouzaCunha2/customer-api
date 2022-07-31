import { inject, injectable } from "inversify";
import { DynamoRepository } from "../../../infrastructure/database/repository/dynamo-repository";
import { CommandHandler } from "../../contracts/command-handler";
import { Result } from "../../contracts/result/result";
import { ResultError } from "../../contracts/result/result-error";
import { ResultSuccess } from "../../contracts/result/result-success";
import { DatabaseHealthCheckCommand } from "./database-health-check-command";

@injectable()
export class DatabaseHealthCheckHandler implements CommandHandler<DatabaseHealthCheckCommand, { message: string }> {
  private readonly dynamoRepository: DynamoRepository;

  public constructor(@inject(DynamoRepository) dynamoRepository: DynamoRepository) {
    this.dynamoRepository = dynamoRepository;
  }

  public async handle(): Promise<Result<{ message: string }>> {
    const limit = 1;
    const result = await this.dynamoRepository.scan(limit);

    if (result.isError) {
      return new ResultError("Error in DynamoDB");
    }

    return new ResultSuccess({ message: "All databases are working" });
  }
}

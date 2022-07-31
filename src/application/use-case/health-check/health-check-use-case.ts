import { inject, injectable } from "inversify";
import { Result } from "../../contracts/result/result";
import { ResultError } from "../../contracts/result/result-error";
import { ResultSuccess } from "../../contracts/result/result-success";
import { UseCase } from "../../contracts/use-case";
import { DatabaseHealthCheckHandler } from "../../handler/health-check/database-health-check-handler";

@injectable()
export class HealthCheckUseCase implements UseCase {
  private readonly DatabaseHealthCheckHandler: DatabaseHealthCheckHandler;

  constructor(@inject(DatabaseHealthCheckHandler) DatabaseHealthCheckHandler: DatabaseHealthCheckHandler) {
    this.DatabaseHealthCheckHandler = DatabaseHealthCheckHandler;
  }

  public async execute(): Promise<Result<{ message: string }>> {
    const result = await this.DatabaseHealthCheckHandler.handle();

    if (result.isError) {
      return new ResultError(result.errorMessage);
    }

    return new ResultSuccess({ message: "All services are working" });
  }
}

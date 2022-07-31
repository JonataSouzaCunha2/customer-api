import { injectable, inject } from "inversify";
import { Route, Controller, Get, Response } from "tsoa";
import { HealthCheckUseCase } from "../../../application/use-case/health-check/health-check-use-case";

import { HttpStatusCode } from "../../../infrastructure/http/http-status-code";
import { handleResult } from "../handle-result";
import { ErrorResult } from "../types";

@injectable()
@Route("health")
export class HealthCheckController extends Controller {
  private readonly healthCheckUseCase: HealthCheckUseCase;

  constructor(
    @inject(HealthCheckUseCase)
    healthCheckUseCase: HealthCheckUseCase,
  ) {
    super();
    this.healthCheckUseCase = healthCheckUseCase;
  }

  /**
   * Health check
   */
  @Get()
  @Response<ErrorResult>(HttpStatusCode.BAD_REQUEST)
  @Response<ErrorResult>(HttpStatusCode.INTERNAL_SERVER_ERROR)
  @Response<ErrorResult>(HttpStatusCode.NOT_FOUND)
  public async healthCheck(): Promise<{ message: string } | ErrorResult> {
    const result = await this.healthCheckUseCase.execute();

    const { data, statusCode } = handleResult(result);
    this.setStatus(statusCode);

    return data;
  }
}

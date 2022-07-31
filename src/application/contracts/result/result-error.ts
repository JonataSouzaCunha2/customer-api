import { ResultStatusEnum } from "./result-status-enum";

export class ResultError {
  public readonly data?: unknown;

  public readonly errorMessage: string;

  public readonly isError: true = true;

  public readonly isRetryable: boolean;

  public readonly status: ResultStatusEnum.ERROR = ResultStatusEnum.ERROR;

  public constructor(errorMessage: string, isRetryable = false) {
    this.errorMessage = errorMessage;
    this.isRetryable = isRetryable;
  }
}

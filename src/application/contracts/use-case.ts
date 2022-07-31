import { Result } from "./result/result";
export interface UseCase {
  execute(params?: object): Promise<Result<object | string>>;
}

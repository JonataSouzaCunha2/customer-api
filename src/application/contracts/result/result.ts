import { ResultError } from "./result-error";
import { ResultNotFound } from "./result-not-found";
import { ResultSuccess } from "./result-success";

export type Result<S = undefined> = ResultSuccess<S> | ResultError | ResultNotFound;

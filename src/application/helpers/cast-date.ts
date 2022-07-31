import { TransformFnParams } from "class-transformer";
import { MaybeNil } from "tsdef";
import { isNullOrUndefined } from "./is-null-or-undefined";

export const parseNillableStringDate: (stringDate: TransformFnParams) => MaybeNil<Date> = (
  stringDate: TransformFnParams,
): MaybeNil<Date> => {
  if (isNullOrUndefined(stringDate.value)) {
    return stringDate.value;
  }

  return new Date(stringDate.value);
};

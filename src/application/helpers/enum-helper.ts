import _ from "lodash";

export const getEnumValues = (enumType: object): number[] =>
  Object.keys(enumType)
    .map(Number)
    .filter((item: number): boolean => !_.isNaN(item));

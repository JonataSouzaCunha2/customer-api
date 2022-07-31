import { FieldErrors } from "@tsoa/runtime";

/**
 * Stringified UUIDv4.
 * See [RFC 4112](https://tools.ietf.org/html/rfc4122)
 * @pattern [0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}
 */
export type UUID = string;

export interface CreateCustomer {
  name: string;
  telephone: string;
  /**
   * @pattern ^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$ Email invalido
   */
  email: string;
  cpf: string;
  /**
   * @isInt
   * @minimum 0
   * @maximum 200
   */
  age: number;
}

export interface UpdateCustomer {
  name?: string;
  telephone?: string;
  /**
   * @pattern ^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$ Email invalido
   */
  email?: string;
  /**
   * @isInt
   * @minimum 0
   * @maximum 200
   */
  age?: number;
}

export interface ErrorResult {
  message: string;
}

export interface ValidationErrorResult extends ErrorResult {
  details: FieldErrors;
}

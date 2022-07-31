import { Express } from "express";

export interface Middleware {
  configure(app: Express): void;
}

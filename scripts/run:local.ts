import { AddressInfo } from "net";
import { developmentBodyParserMiddleware } from "../development/development-body-parser-middleware";
import { developmentMiddleware } from "../development/development-middleware";
import express from "express";

const DEFAULT_HTTP_PORT = 3000;

const app = express();

app.use(developmentBodyParserMiddleware());
app.use(developmentMiddleware());

const server = app.listen(DEFAULT_HTTP_PORT);

const address = server.address() as AddressInfo;
const port = address?.port ?? 0;

console.log(`Application listening on port ${port}`);

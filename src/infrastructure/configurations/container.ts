import * as Types from "./types";

import { Container, decorate, injectable } from "inversify";

import { BodyParserMiddleware } from "../../interface/api/middlewares/body-parser-middleware";
import { Controller } from "tsoa";
import { CreateCustomerHandler } from "../../application/handler/customers/create/create-customer-handler";
import { CreateCustomerUseCase } from "../../application/use-case/customers/create/create-customer-use-case";
import { CustomerRepository } from "../database/repository/customer-repository";
import { CustomersController } from "../../interface/api/controllers/customers-controller";
import { DatabaseHealthCheckHandler } from "../../application/handler/health-check/database-health-check-handler";
import { DeleteCustomerHandler } from "../../application/handler/customers/delete/delete-customer-handler";
import { DeleteCustomerUseCase } from "../../application/use-case/customers/delete/delete-customer-use-case";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { DynamoRepository } from "../database/repository/dynamo-repository";
import { ErrorMiddleware } from "../../interface/api/middlewares/error-middleware";
import { FindCustomerByIdHandler } from "../../application/handler/customers/find-by-id/find-customer-by-id-handler";
import { FindCustomerByIdUseCase } from "../../application/use-case/customers/find-by-id/find-customer-by-id-use-case";
import { HealthCheckController } from "../../interface/api/controllers/health-check-controller";
import { HealthCheckUseCase } from "../../application/use-case/health-check/health-check-use-case";
import { ListCustomerHandler } from "../../application/handler/customers/list/list-customer-handler";
import { ListCustomerUseCase } from "../../application/use-case/customers/list/list-customer-use-case";
import { ProcessHttpRequest } from "../../interface/api/process-http-request";
import { SearchCustomerHandler } from "../../application/handler/customers/search/search-customer-handler";
import { SearchCustomerUseCase } from "../../application/use-case/customers/search/search-customer-use-case";
import { Settings } from "./settings";
import { UpdateCustomerHandler } from "../../application/handler/customers/update/update-customer-handler";
import { UpdateCustomerUseCase } from "../../application/use-case/customers/update/update-customer-use-case";
import { createDocumentClient } from "../database/document-client";

const container: Container = new Container();

decorate(injectable(), Controller);

// Values
container.bind(Container).toConstantValue(container);
container.bind(Types.Envs).toConstantValue(process.env);

// Command handlers
container.bind(CreateCustomerHandler).toSelf();
container.bind(ListCustomerHandler).toSelf();
container.bind(FindCustomerByIdHandler).toSelf();
container.bind(UpdateCustomerHandler).toSelf();
container.bind(DeleteCustomerHandler).toSelf();
container.bind(SearchCustomerHandler).toSelf();
container.bind(DatabaseHealthCheckHandler).toSelf();

// Use cases
container.bind(HealthCheckUseCase).toSelf();
container.bind(CreateCustomerUseCase).toSelf();
container.bind(ListCustomerUseCase).toSelf();
container.bind(FindCustomerByIdUseCase).toSelf();
container.bind(UpdateCustomerUseCase).toSelf();
container.bind(DeleteCustomerUseCase).toSelf();
container.bind(SearchCustomerUseCase).toSelf();

// Infrastructure
container.bind(DocumentClient).toConstantValue(createDocumentClient());
container.bind(Settings).toSelf();

// Interface
container.bind(BodyParserMiddleware).toSelf();
container.bind(ErrorMiddleware).toSelf();
container.bind(ProcessHttpRequest).toSelf();

// Controller
container.bind(CustomersController).toSelf();
container.bind(HealthCheckController).toSelf();

// Repository
container.bind(CustomerRepository).toSelf();
container.bind(DynamoRepository).toSelf();

export { container, container as iocContainer };

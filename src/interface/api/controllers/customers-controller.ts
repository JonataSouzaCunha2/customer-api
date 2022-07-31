/* eslint-disable sonarjs/no-duplicate-string */
import { injectable, inject } from "inversify";
import { Route, Controller, Tags, Body, Response, Post, Get, Path, Put, Delete, Query } from "tsoa";
import { HttpStatusCode } from "../../../infrastructure/http/http-status-code";
import { handleResult } from "../handle-result";
import { CreateCustomer, ErrorResult, UpdateCustomer, UUID } from "../types";

import { Customer } from "../../../domain/entities/customer";
import { CreateCustomerUseCase } from "../../../application/use-case/customers/create/create-customer-use-case";
import { ListCustomerUseCase } from "../../../application/use-case/customers/list/list-customer-use-case";
import { FindCustomerByIdUseCase } from "../../../application/use-case/customers/find-by-id/find-customer-by-id-use-case";
import { DeleteCustomerUseCase } from "../../../application/use-case/customers/delete/delete-customer-use-case";
import { UpdateCustomerUseCase } from "../../../application/use-case/customers/update/update-customer-use-case";
import { SearchCustomerUseCase } from "../../../application/use-case/customers/search/search-customer-use-case";

@injectable()
@Route()
export class CustomersController extends Controller {
  private readonly createCustomerUseCase: CreateCustomerUseCase;
  private readonly listCustomerUseCase: ListCustomerUseCase;
  private readonly findCustomerByIdUseCase: FindCustomerByIdUseCase;
  private readonly updateCustomerUseCase: UpdateCustomerUseCase;
  private readonly deleteCustomerUseCase: DeleteCustomerUseCase;
  private readonly searchCustomerUseCase: SearchCustomerUseCase;

  constructor(
    @inject(CreateCustomerUseCase)
    createCustomerUseCase: CreateCustomerUseCase,
    @inject(ListCustomerUseCase)
    listCustomerUseCase: ListCustomerUseCase,
    @inject(FindCustomerByIdUseCase)
    findCustomerByIdUseCase: FindCustomerByIdUseCase,
    @inject(UpdateCustomerUseCase) updateCustomerUseCase: UpdateCustomerUseCase,
    @inject(DeleteCustomerUseCase) deleteCustomerUseCase: DeleteCustomerUseCase,
    @inject(SearchCustomerUseCase) searchCustomerUseCase: SearchCustomerUseCase,
  ) {
    super();
    this.createCustomerUseCase = createCustomerUseCase;
    this.listCustomerUseCase = listCustomerUseCase;
    this.findCustomerByIdUseCase = findCustomerByIdUseCase;
    this.updateCustomerUseCase = updateCustomerUseCase;
    this.deleteCustomerUseCase = deleteCustomerUseCase;
    this.searchCustomerUseCase = searchCustomerUseCase;
  }

  /**
   * Insert an new customer
   * @param customerPayload Extra information required to insert the customer
   */
  @Tags("Customers")
  @Post("/customers")
  @Response<ErrorResult>(HttpStatusCode.BAD_REQUEST)
  @Response<ErrorResult>(HttpStatusCode.INTERNAL_SERVER_ERROR)
  @Response<ErrorResult>(HttpStatusCode.NOT_FOUND)
  public async create(@Body() customerPayload: CreateCustomer): Promise<Customer | ErrorResult> {
    const result = await this.createCustomerUseCase.execute(customerPayload);

    const { data, statusCode } = handleResult<Customer>(result);

    this.setStatus(statusCode);

    return data;
  }

  /**
   * Find all customers
   */
  @Tags("Customers")
  @Get("/customers")
  @Response<ErrorResult>(HttpStatusCode.BAD_REQUEST)
  @Response<ErrorResult>(HttpStatusCode.INTERNAL_SERVER_ERROR)
  @Response<ErrorResult>(HttpStatusCode.NOT_FOUND)
  public async list(): Promise<Customer[] | ErrorResult> {
    const result = await this.listCustomerUseCase.execute();

    const { data, statusCode } = handleResult<Customer[]>(result);

    this.setStatus(statusCode);

    return data;
  }

  /**
   * Search all customers by free text
   * @param freeText Text that will search in all fields of the customer
   */
  @Tags("Customers")
  @Get("/customersSearch")
  @Response<ErrorResult>(HttpStatusCode.BAD_REQUEST)
  @Response<ErrorResult>(HttpStatusCode.INTERNAL_SERVER_ERROR)
  @Response<ErrorResult>(HttpStatusCode.NOT_FOUND)
  public async search(@Query() freeText?: string): Promise<Customer[] | ErrorResult> {
    const result = await this.searchCustomerUseCase.execute({ freeText });

    const { data, statusCode } = handleResult<Customer[]>(result);

    this.setStatus(statusCode);

    return data;
  }

  /**
   * Find customer by customerId
   * @param customerId The customer uuid
   */
  @Tags("Customers")
  @Get("/customers/{customerId}")
  @Response<ErrorResult>(HttpStatusCode.BAD_REQUEST)
  @Response<ErrorResult>(HttpStatusCode.INTERNAL_SERVER_ERROR)
  @Response<ErrorResult>(HttpStatusCode.NOT_FOUND)
  public async findById(@Path() customerId: UUID): Promise<Customer | ErrorResult> {
    const result = await this.findCustomerByIdUseCase.execute({ customerId });

    const { data, statusCode } = handleResult<Customer>(result);

    this.setStatus(statusCode);

    return data;
  }

  /**
   * Update an specific customer
   * @param customerId The customer uuid
   * @param customerUpdate Customer fields that will be updated
   */
  @Tags("Customers")
  @Put("/customers/{customerId}")
  @Response<ErrorResult>(HttpStatusCode.BAD_REQUEST)
  @Response<ErrorResult>(HttpStatusCode.INTERNAL_SERVER_ERROR)
  @Response<ErrorResult>(HttpStatusCode.NOT_FOUND)
  public async update(
    @Path() customerId: UUID,
    @Body() customerUpdate: UpdateCustomer,
  ): Promise<Customer | ErrorResult> {
    const result = await this.updateCustomerUseCase.execute({ ...customerUpdate, customerId });

    const { data, statusCode } = handleResult<Customer>(result);

    this.setStatus(statusCode);

    return data;
  }

  /**
   * Delete an customer
   * @param customerId The customer uuid
   */
  @Tags("Customers")
  @Delete("/customers/{customerId}")
  @Response<ErrorResult>(HttpStatusCode.BAD_REQUEST)
  @Response<ErrorResult>(HttpStatusCode.INTERNAL_SERVER_ERROR)
  @Response<ErrorResult>(HttpStatusCode.NOT_FOUND)
  public async delete(@Path() customerId: UUID): Promise<string | ErrorResult> {
    const result = await this.deleteCustomerUseCase.execute({ customerId });

    const { data, statusCode } = handleResult<string>(result);

    this.setStatus(statusCode);

    return data;
  }
}

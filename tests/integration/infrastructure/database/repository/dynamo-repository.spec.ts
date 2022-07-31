import { container } from "../../../../../src/infrastructure/configurations/container";
import { createDynamoTable, dropDynamoTables } from "../../../../system/helpers/database-helper";
import { DynamoRepository } from "../../../../../src/infrastructure/database/repository/dynamo-repository";
import { ResultStatusEnum } from "../../../../../src/application/contracts/result/result-status-enum";

const dynamoRepository = container.get(DynamoRepository);

describe("Integration", () => {
  describe("Dynamo Repository", () => {
    beforeEach(createDynamoTable);
    afterEach(dropDynamoTables);

    describe("scan", () => {
      it("Should return an error when the table does not exist", async () => {
        // Given
        await dropDynamoTables();

        const expectedResult = {
          errorMessage: "Failed to scan table",
          isError: true,
          isRetryable: false,
          status: ResultStatusEnum.ERROR,
        };

        // When
        const result = await dynamoRepository.scan(1);

        // Then
        expect(result).toEqual(expectedResult);
      });

      it("Should return a success when the table exists", async () => {
        // Given
        const expectedResult = {
          data: {
            Count: 0,
            Items: [],
            ScannedCount: 0,
          },
          isError: false,
          status: ResultStatusEnum.SUCCESS,
        };

        // When
        const result = await dynamoRepository.scan(1);

        // Then
        expect(result).toEqual(expectedResult);
      });
    });
  });
});

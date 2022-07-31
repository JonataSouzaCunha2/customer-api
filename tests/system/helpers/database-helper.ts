import { DynamoDB } from "aws-sdk";
import { Settings } from "../../../src/infrastructure/configurations/settings";
import faker from "faker";
import { isNullOrUndefined } from "../../../src/application/helpers/is-null-or-undefined";

const dynamoDbTable = process.env.DYNAMODB_TABLE;

export const dropDynamoTables = async (): Promise<void> => {
  const settings = new Settings(process.env);

  try {
    const client = new DynamoDB({
      endpoint: settings.dynamodbEndpoint,
    });

    const tables = await client.listTables().promise();

    if (isNullOrUndefined(tables.TableNames)) {
      return;
    }

    for (const tableName of tables.TableNames) {
      if (tableName !== dynamoDbTable) {
        await client
          .deleteTable({
            TableName: tableName,
          })
          .promise();
      }
    }
  } catch (error) {
    console.log("Failed to drop table", { error });
  }
};

export const createDynamoTable = async (): Promise<void> => {
  const settings = new Settings(process.env);
  const dynamoDb = new DynamoDB({
    endpoint: settings.dynamodbEndpoint,
  });

  process.env.DYNAMODB_TABLE = faker.random.uuid();

  await dynamoDb
    .createTable({
      TableName: settings.dynamodbTable,
      AttributeDefinitions: [
        {
          AttributeName: "pk",
          AttributeType: "S",
        },
        {
          AttributeName: "sk",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "pk",
          KeyType: "HASH",
        },
        {
          AttributeName: "sk",
          KeyType: "RANGE",
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10,
      },
    })
    .promise();

  await dynamoDb
    .updateTimeToLive({
      TableName: settings.dynamodbTable,
      TimeToLiveSpecification: {
        AttributeName: "ttl",
        Enabled: true,
      },
    })
    .promise();
};

export const restartOriginalTable = (): void => {
  process.env.DYNAMODB_TABLE = dynamoDbTable;
};

import "reflect-metadata";

import { DynamoDB } from "aws-sdk";
import { configTenantSeeds } from "./seed";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const dynamodbTable = process.env.DYNAMODB_TABLE as string;
const dynamodbEndpoint = process.env.DYNAMODB_ENDPOINT as string;
async function saveConfig(data: {}): Promise<void> {
  try {
    const documentClient = new DocumentClient({
      endpoint: dynamodbEndpoint,
    });
    await documentClient
      .put({
        Item: data,
        TableName: dynamodbTable,
      })
      .promise();
  } catch (error) {
    console.log("DynamoDB Helper: saveConfig Error: ", error);
  }
}

(async function configureDynamo(): Promise<void> {
  const dynamoDb = new DynamoDB({
    endpoint: dynamodbEndpoint,
  });

  const tables = await dynamoDb.listTables().promise();
  const tableExists = tables.TableNames?.some((name: string) => [dynamodbTable].includes(name));

  if (tableExists) {
    return;
  }

  await dynamoDb
    .createTable({
      TableName: dynamodbTable,
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

  configTenantSeeds.forEach(async (configTenantSeed) => {
    await saveConfig(configTenantSeed);
  });
})();

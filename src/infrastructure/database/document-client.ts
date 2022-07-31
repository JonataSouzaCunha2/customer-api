import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Settings } from "../configurations/settings";

const settings = new Settings(process.env);

export const createDocumentClient = (): DocumentClient => {
  return new DocumentClient({
    endpoint: settings.dynamodbEndpoint,
    sslEnabled: false,
  });
};

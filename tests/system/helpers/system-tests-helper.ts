import { createDynamoTable, dropDynamoTables, restartOriginalTable } from "./database-helper";

export const beforeSystemTest = async (): Promise<void> => {
  await createDynamoTable();
};

export const afterSystemTest = async (): Promise<void> => {
  await dropDynamoTables();
};

export const afterAllSystemTest = (): void => {
  restartOriginalTable();
};

import { NonFunctionPropertyNames } from "../../../../src/application/contracts/types";
import { Settings } from "../../../../src/infrastructure/configurations/settings";
import faker from "faker";

const createAssertAndReturnDefinedStringSetting = (
  property: NonFunctionPropertyNames<Settings>,
  settingEnvName: string,
): void => {
  it("Should return the setting When it is defined", (): void => {
    // Given
    const settings = new Settings(process.env);
    process.env[settingEnvName] = faker.lorem.word();

    // When
    const setting: string | number | undefined = settings[property];

    // Then
    expect(setting).toEqual(process.env[settingEnvName]);
  });
};

const createThrowIfSettingIsUndefined = (
  property: NonFunctionPropertyNames<Settings>,
  settingEnvName: string,
): void => {
  it("Should throw an error When setting is undefined", (): void => {
    // Given
    const settings = new Settings({});

    // When
    const getSetting = (): string | number | undefined => settings[property];

    // Then
    expect(getSetting).toThrow(new Error(`Empty setting: ${settingEnvName}`));
  });
};

const createAssertAndReturnStringSetting = (
  property: NonFunctionPropertyNames<Settings>,
  settingEnvName: string,
): void => {
  describe(property, (): void => {
    createThrowIfSettingIsUndefined(property, settingEnvName);
    createAssertAndReturnDefinedStringSetting(property, settingEnvName);
  });
};

describe("Unit", () => {
  describe("Infrastructure", () => {
    describe("Configurations", () => {
      describe("Settings", () => {
        createAssertAndReturnStringSetting("dynamodbEndpoint", "DYNAMODB_ENDPOINT");
        createAssertAndReturnStringSetting("dynamodbTable", "DYNAMODB_TABLE");
      });
    });
  });
});

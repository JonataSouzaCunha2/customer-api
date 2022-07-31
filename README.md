### Documentation of endpoints

The Documentation of the endpoints is at swagger.yaml, i use the preview swagger extension in vscode
to see this documentation. The base route is http://localhost:3000/customers/api/v0/

### Setup

To start this project:

- run `npm install`
- run `docker-compose up`

### Testing

First alternative, is used to execute all tests:

- Just run `make test`

Second alternative, is used to execute specific test:

- Run `docker-compose up -d`
- Run `docker-compose exec -T application npm run test:system`

### Lint

To verify if any lint rule was broken run: `npm run lint`.

### Connecting to Dynamodb

To connect to dynamodb I recommend using dynamodb workbench

- First install the dynamo workbench by following the tutorial `https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/workbench.settingup.html`
- Connect using the values of the localstack environments that are in docker-compose

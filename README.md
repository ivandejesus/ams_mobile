# AMS MOBILE

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.1.1

#### System Requirements

NPM v6.4.1
Node v10.14.1
Angular CLI v7.1.1

### Development

docker-compose -f docker-compose.dev.yml up -d --force-recreate

Go to localhost:4200 on your browser and you will see the app.

### Deployment With Docker

#### Creating container with compose

```
ENV=config/environment/test-variables.env docker-compose up -d --build --force-recreate // for test server
ENV=config/environment/stage-variables.env docker-compose up -d --build --force-recreate // for test server
ENV=config/environment/prod-variables.env docker-compose up -d --build --force-recreate // for prod server
```

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build. This is automatically being done when we up docker on production.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running unit tests with headless chrome and code coverage
Run `npm run test:headless`

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Non-docker development

Just install angular-cli@7.1.1 then inside the project root folder run `ng serve`.

Note: Run npm install if node_modules is not available.
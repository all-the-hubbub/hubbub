# Hubbub Web Application

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0.

## Initial Dev Setup

Install and configure:
* [Node.js](https://nodejs.org/en/). We recommend using [nvm](https://github.com/creationix/nvm) to install Node.js and ensure we're using the right version:
```bash
nvm install v6.9.1
nvm use v6.9.1
```
* [Yarn](https://yarnpkg.com), required for yarn.lock sanity. If you're using homebrew:
```bash
brew install yarn
yarn install
```
* The [Angular CLI](https://cli.angular.io/):
```bash
npm install -g @angular/cli
ng set --global packageManager=yarn
```
* The [Firebase CLI](https://firebase.google.com/docs/cli/), and sign in:
```bash
npm install -g firebase-tools
firebase login
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Deploy to your firebase project online
```bash
npm run deploy
```

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# SaftyTq

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

Tener en cuenta la creacion de los archivos environments

ng generate environments

// src/environments/environment.ts
export const environment = {
production: true,
firebaseConfig: {
apiKey: 'YOUR_API_KEY',
authDomain: 'YOUR_AUTH_DOMAIN',
projectId: 'YOUR_PROJECT_ID',
storageBucket: 'YOUR_STORAGE_BUCKET',
messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
appId: 'YOUR_APP_ID',
measurementId: 'YOUR_MEASUREMENT_ID',
},
};

// src/environments/environment.developments.ts
export const environment = {
production: false,
firebaseConfig: {
apiKey: 'YOUR_API_KEY',
authDomain: 'YOUR_AUTH_DOMAIN',
projectId: 'YOUR_PROJECT_ID',
storageBucket: 'YOUR_STORAGE_BUCKET',
messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
appId: 'YOUR_APP_ID',
measurementId: 'YOUR_MEASUREMENT_ID',
},
};

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// currently we just use staging config for dev, but you could put your own
// project here and `ng serve` would use that
export const environment = {
  production: false,
  name: 'dev',
  config: {
  "apiKey": "AIzaSyAxhoUSVxJfouGxwPQXSCnw1hyF-zH2uSs",
  "databaseURL": "https://hubbub-dev-c41cd.firebaseio.com",
  "storageBucket": "hubbub-dev-c41cd.appspot.com",
  "authDomain": "hubbub-dev-c41cd.firebaseapp.com",
  "messagingSenderId": "466710443666",
  "projectId": "hubbub-dev-c41cd",
  "functionRoot": "https://us-central1-hubbub-dev-c41cd.cloudfunctions.net",
  }

};

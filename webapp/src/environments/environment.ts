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
    "apiKey": "AIzaSyC1u9c5E81QSXv9Nh2c7H8pO_dBt2tN0k8",
    "databaseURL": "https://hubbub-staging.firebaseio.com",
    "storageBucket": "hubbub-staging.appspot.com",
    "authDomain": "hubbub-staging.firebaseapp.com",
    "messagingSenderId": "855593303793",
    "projectId": "hubbub-staging",
    "functionRoot": "https://us-central1-hubbub-staging.cloudfunctions.net",
  }

};

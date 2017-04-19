# Hubbub




## Dev Setup

install
* [yarn](https://yarnpkg.com) -- required for yarn.lock sanity
* [nvm](https://github.com/creationix/nvm) -- recommended

```
nvm use v6.9.1
npm install -g @angular/cli
ng set --global packageManager=yarn
cd webapp
yarn
```

Deploy webapp
```
cd webapp
npm run deploy
```
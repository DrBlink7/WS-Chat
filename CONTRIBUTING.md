# Code Challenge

This application is created via [craco](https://craco.js.org/docs/), before launching the application, you need to create a .env file by copying the [env example](/.env.example) file, for example, with:

```bash
REACT_APP_MODE=DEV
REACT_APP_AUTHORIZATION=authorization
REACT_APP_KEY=unaChiaveSegreta
```

The Code Challenge frontend can be launched in two ways, through a Docker container or locally.

## Docker Container

Convenient container runnable via Docker Compose

### Requirements

- Docker desktop (for Windows/Mac users)
- Docker (for Linux users)

### Procedure

If you don't want unnecessary node modules, install the required Node version, yarn (and other dependencies), and you want to quickly launch the repo, just open a terminal in the root of the repo and run the command:

```bash
docker compose up --build
```

The `node:lts-alpine` container image will be downloaded, and the commands in the [Dockerfile](/Dockerfile) will be executed.

Once the environment is up, go to a [browser](http://localhost:3000).

To stop the execution, simply press Ctrl+C (or Command+C on Mac) and then the command:

```bash
docker compose down
```

## Local

Classic method

### Requirements

- Node 18.17.1
- yarn >= 1.22.19

### Procedure

To launch the application, just open a terminal in the root of the repo and run the command:

```bash
yarn
yarn start
```

## Test

To run the tests, open a terminal in the root of the repo and run the command:

```bash
yarn test
```

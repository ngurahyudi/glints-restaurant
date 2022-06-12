[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Run using docker compose

```bash
$ git clone --depth 1 https://github.com/ngurahyudi/glints-restaurant.git glints-restaurant

$ cd glints-restaurant/

$ cp env-copy .env

$ docker-compose up -d
```

## Development

```bash
$ git clone --depth 1 https://github.com/ngurahyudi/glints-restaurant.git glints-restaurant

$ cd glints-restaurant/

$ cp env-copy .env
```

- Change `DATABASE_HOST=restaurant-mysql` to `DATABASE_HOST=localhost`

```bash
$ yarn install

$ yarn migration:run

$ yarn seed:run

$ yarn start:dev
```

- Swagger: http://localhost:3000/docs

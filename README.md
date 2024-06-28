# Fitnest: Web API

[![CD Pipeline](https://github.com/fitnestcorp/fitnest-api-backend/actions/workflows/cd.yml/badge.svg?branch=main)](https://github.com/fitnestcorp/fitnest-api-backend/actions/workflows/cd.yml) [![CI Pipeline](https://github.com/fitnestcorp/fitnest-api-backend/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/fitnestcorp/fitnest-api-backend/actions/workflows/ci.yml)

This repo hosts all the files for the Fitnest online store API made with [NestJS 10](https://nestjs.com/) and deployed to [AWS](https://aws.amazon.com/) throuhg [ECS](https://aws.amazon.com/ecs/) using [Docker](https://www.docker.com/get-started/).

## Prerequisites

For both development and production, you will need to have a `.env` file and a PostgreSQL 16 database running (apart from the obvious Node.js and npm).

### `.env`

An example `.env` file with all the needed variables is provided in the [`.env.example`](https://github.com/fitnestcorp/fitnest-api-backend/blob/main/.env.example) file.

### PostgreSQL

You can install PostgreSQL 16 from the [official website](https://www.postgresql.org/download/) or run it as a docker container with the following command using docker run adn docker volumes:

``` bash
docker run --name fitnest-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=fitnest -p 5432:5432 -v fitnest-db-data:/var/lib/postgresql/data -d postgres:16
```

This will create a new container named `fitnest-db` with the password `password` and the database `fitnest` on port 5432.

#### Note: **We DO NOT recommend...**
- using the default password `password` in production.
- exposing the DB server to the internet.
- using docker to host the DB server in production.

## Local Development

You can run NestJS in development mode with the following commands:

``` bash
# install dependencies
npm install

# start dev server
npm run start:dev
```

which will create the NestJS dev server on port 3000.

## Production

Any [node.js](https://nodejs.org/en/blog/release/v20.15.0) environment will suffice to run the production server, however, this project was deployed to ECS using [Docker](https://www.docker.com/get-started/) for ease.

### Node.js

``` bash
# install production dependencies
npm ci

# build the project
npm run build

# start production server
node dist/main.js
```

### Docker

You can build and run the Docker container with the following command:

> Note that the .env file must be in the same directory as the Dockerfile before building the image

``` bash
# build the image
docker build -t fitnest-api .

# run the container
docker run -p 3000:3000 -d fitnest-api
```

## CI/CD Pipelines

This repo has github actions workflows configured for testing on every push to every branch (CI) and deploying to ECR and ECS on any push to the main branch (CD).

The [`.secrets.example`](https://github.com/fitnestcorp/fitnest-api-backend/blob/main/.secrets.example) file contains all the secrets you need to have a working CD pipeline, configurations in AWS is needed to create the ECR repository and ECS cluster, service, tasks and load balancer.
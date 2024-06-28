FROM node:20.15.0-alpine3.20 AS build

WORKDIR /fitnest

COPY package*.json ./

RUN npm install

COPY tsconfig.* ./

COPY .env ./

COPY src ./src

RUN npm run build

FROM node:20.15.0-alpine3.20 AS prod

COPY --chown=node:node --from=build /fitnest/node_modules /fitnest/node_modules

COPY --chown=node:node --from=build /fitnest/dist /fitnest/dist

COPY --chown=node:node us-east-1-bundle.pem ./

COPY --chown=node:node .env ./

USER node

EXPOSE 3000

CMD ["node", "/fitnest/dist/main.js"]
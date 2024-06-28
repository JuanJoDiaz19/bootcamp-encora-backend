FROM node:20.15.0-alpine3.20 AS build

WORKDIR /fitnest

COPY package*.json ./

RUN npm install

COPY tsconfig.* ./

COPY us-east-1-bundle.pem ./

COPY .env ./

COPY src ./src

RUN npm run build

FROM node:20.15.0-alpine3.20 AS prod

COPY --chown=node:node --from=build /fitnest/node_modules /fitnest/node_modules

COPY --chown=node:node --from=build /fitnest/dist /fitnest/dist

# least privileged user
RUN chown -R node:node /fitnest

USER node

EXPOSE 3000

CMD ["node", "/fitnest/dist/main.js"]
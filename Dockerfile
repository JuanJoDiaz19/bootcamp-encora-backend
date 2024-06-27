FROM node:20.15.0-alpine3.20 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY tsconfig.* ./

COPY .env ./

COPY src ./src

RUN npm run build

FROM node:20.15.0-alpine3.20 AS production

RUN addgroup -S nonroot && adduser -S nonroot -G nonroot

WORKDIR /app

COPY --from=build /app/node_modules /app/node_modules

COPY --from=build /app/dist /app/dist

# least privileged user
RUN chown -R nonroot:nonroot /app

USER nonroot

EXPOSE 3000

CMD ["node", "dist/main.js"]
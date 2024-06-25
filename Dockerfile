# use node 20.15.0 distroless for a minimized image size
FROM gcr.io/distroless/nodejs20-debian12 AS deps

WORKDIR /app

COPY package*.json ./

RUN npm install

FROM deps AS build

COPY src ./src

RUN npm run build

# use node 20.15.0 distroless for a minimized image size
FROM build AS production

EXPOSE 3000

CMD ["node", "dist/main"]

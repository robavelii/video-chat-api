FROM node:16 AS dist
COPY package.json yarn.lock ./
RUN yarn install
COPY . ./
RUN yarn build:prod

FROM node:16 AS node_modules
COPY package.json yarn.lock ./
RUN yarn install --prod

# Install Redis
FROM redis:latest AS redis

FROM node:16
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY --from=dist /usr/src/app/dist /usr/src/app/dist
COPY --from=node_modules /usr/src/app/node_modules /usr/src/app/node_modules
COPY . /usr/src/app

# Copy Redis from the Redis image
COPY --from=redis /usr/local/bin/redis* /usr/local/bin/
COPY --from=redis /usr/local/lib/redis* /usr/local/lib/

CMD [ "yarn", "start:prod" ]

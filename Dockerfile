FROM node:16-alpine

WORKDIR /api

COPY package.json .

RUN npm install --only-prod
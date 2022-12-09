FROM node:16

WORKDIR /usr/src/api

COPY package.json .

RUN npm install

COPY ./dist ./dist
FROM node:8.1.0-alpine

WORKDIR /usr/app

COPY package.json .
RUN npm install --quiet

COPY . .
FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache --virtual .build-deps build-base python3

COPY .env .env

COPY package*.json ./
COPY src/infrastructure/config/services/serviceAccountKey.json /app/dist/infrastructure/config/services/serviceAccountKey.json


RUN npm install

COPY . .

RUN npm run build

EXPOSE 8000

RUN apk del .build-deps

ENV NODE_ENV=production

ENV PORT=8000

CMD ["node", "dist/index.js"]
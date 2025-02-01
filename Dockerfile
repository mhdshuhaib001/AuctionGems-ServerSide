FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p dist/infrastructure/config/services

RUN npm run build

COPY src/infrastructure/config/services/serviceAccountKey.json dist/infrastructure/config/services/

ENV NODE_OPTIONS="--max-old-space-size=2048"

EXPOSE 8080

CMD ["npm", "start"]
FROM node:lts-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "/app/src/app.js"]

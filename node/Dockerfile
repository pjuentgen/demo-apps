#Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build
#Production stage
FROM node:18-alpine AS production
WORKDIR /app
COPY package*.json .
RUN npm ci --omit=dev --ignore-scripts
COPY --from=build /app/dist ./dist
RUN rm -Rf app/dist/tests
CMD ["node", "dist/server.js"]

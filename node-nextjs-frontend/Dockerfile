# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy rest of the app
COPY . .

# Build Next.js app
RUN npm run build

# Remove dev dependencies after build
RUN npm ci --omit=dev

# Expose port
EXPOSE 3000

# Start Next.js app
CMD ["npm", "start"]

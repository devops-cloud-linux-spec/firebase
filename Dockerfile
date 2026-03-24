# Use official Node image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the project
COPY . .

# Build TypeScript
RUN npm run build

# Expose app port (change if needed)
EXPOSE 3000

# Run compiled JS
CMD ["node", "dist/index.js"]

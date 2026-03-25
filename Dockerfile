FROM node:18-alpine

WORKDIR /app

# Copy everything
COPY . .

# Install all dependencies (including dev)
RUN npm install

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]

# Use official Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy everything (monorepo)
COPY . .

# Install dependencies using npm workspaces
RUN npm install

# Set working directory to auth-service
WORKDIR /app/apps/auth-service

# Expose the service port
EXPOSE 8080

# Start the service
CMD ["npx", "ts-node-dev", "--respawn", "--transpile-only", "src/app.ts"]

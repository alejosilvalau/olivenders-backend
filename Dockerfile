FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Build TypeScript code if needed
RUN npm run build

# Expose the port your application runs on
EXPOSE 3000

# Add this before the CMD line
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

# Command to run the application
CMD ["node", "dist/index.js"]
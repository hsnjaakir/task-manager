# task-manager-frontend/Dockerfile
FROM node:20

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Expose Vite dev port
EXPOSE 5173

# Run Vite development server
CMD ["npm", "run", "dev"]

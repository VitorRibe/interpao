# Build stage
FROM node:20-slim AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build the project
COPY . .
RUN npm run build

# Production stage using Nginx to serve the static files
FROM nginx:stable-alpine

# Copy the build output from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: Copy a custom nginx configuration if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

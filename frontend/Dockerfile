# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
# Add this line to copy your nginx config into the container
COPY nginx.conf /etc/nginx/conf.d/default.conf

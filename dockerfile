# Stage 1: Build the Vite app
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
COPY vite.config.* ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the built app with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

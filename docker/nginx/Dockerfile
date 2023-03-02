# The first stage
# Build React static files
FROM node:18 as build

RUN yarn install

WORKDIR /app/frontend
COPY ./frontend/package.json ./
COPY ./frontend/yarn.lock ./
RUN yarn
COPY ./frontend/ ./
RUN yarn build

# The second stage
# Copy React static files and start nginx
FROM nginx:stable
COPY --from=build /app/frontend/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]

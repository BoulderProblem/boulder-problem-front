# Étape 1 : build Vite
FROM node:18 AS build

WORKDIR /app

ARG VITE_URL
ARG VITE_API_BASE_URL
ENV VITE_URL=${VITE_URL}
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Étape 2 : image Nginx
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

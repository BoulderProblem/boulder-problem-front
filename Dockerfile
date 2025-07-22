# Étape 1 : Construction de l'application
FROM node:20 AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires
COPY package*.json ./
RUN npm install

# Copier le reste de l'application
COPY . .

# Construire l'application React
RUN npm run build

# Étape 2 : Serveur Nginx pour servir l'app en production
FROM nginx:alpine

# Supprimer la configuration par défaut
RUN rm -rf /usr/share/nginx/html/*

# Copier les fichiers construits depuis l'étape précédente
COPY --from=build /app/build /usr/share/nginx/html

# Copier une config nginx personnalisée si nécessaire
# COPY nginx.conf /etc/nginx/nginx.conf

# Exposer le port 80
EXPOSE 80

# Lancer nginx
CMD ["nginx", "-g", "daemon off;"]

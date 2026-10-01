# Utiliza una imagen base de Node.js
FROM node:21

Workdir /app

copy package*.json ./
copy server.ts ./

run npm install

EXPOSE 3000

cmd ["node", "server.ts"]
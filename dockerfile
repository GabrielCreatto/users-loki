FROM node:latest
WORKDIR /srv/app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3001
CMD ["node", "build/index.js"]
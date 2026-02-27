FROM node:20-alpine3.18 as builder

WORKDIR /app
COPY package*.json ./
RUN npm install --production
RUN npm install --save-dev typescript
COPY . .
RUN npm run build
EXPOSE 3000
CMD [ "npm","run","start" ] 

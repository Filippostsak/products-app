#version of node to use
FROM node:16

#Directory to save image
WORKDIR /app

#Install app dependencies
#A wildcard is used to ensure that both packages
COPY package*.json ./
RUN npm install
#Copy app files to /app
COPY . .
EXPOSE 3000
CMD ["npm","run","start"]
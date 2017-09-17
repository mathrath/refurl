FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# Install app dependencies
RUN npm install

EXPOSE 8080
CMD [ "npm", "start" ]

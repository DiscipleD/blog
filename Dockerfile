# can use node version tag like :onbuild, :latest, but which is not stable version may cause update error
# detail on https://hub.docker.com/_/node/
FROM node:8

MAINTAINER Disciple.Ding <disciple.ding@gmail.com>

# Create app work directory
RUN mkdir -p /usr/app
WORKDIR /usr/app

# Use the cache as long as contents of package.json hasn't changed.
COPY package.json /usr/app/

RUN npm install

# Bundle app source
COPY . /usr/app

# Build Source
RUN npm run build

EXPOSE 8080

VOLUME /usr/app

CMD [ "npm", "run", "start:server" ]

# can use node version tag like :onbuild, :latest, but which is not stable version may cause update error
# detail on https://hub.docker.com/_/node/
FROM node:6

MAINTAINER Disciple.Ding <disciple.ding@gmail.com>

# Create app directory
RUN mkdir -p /usr/app
WORKDIR /usr/app

# We add package.json first so that the  docker image build
# can use the cache as long as contents of package.json
# hasn't changed.
COPY package.json /usr/app/

# preinstall will cause error in docker environment
# Install preinstall package in single process.
RUN npm install node-sass
RUN npm install gifsicle
RUN npm install jpegtran-bin
RUN npm install optipng-bin
RUN npm install pngquant-bin

# Install other package
RUN npm install

# Bundle app source
COPY . /usr/app

RUN npm run build

EXPOSE 8080

VOLUME /usr/app/log

CMD [ "npm", "run", "start:server" ]
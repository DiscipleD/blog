# can use node version tag like :onbuild, :latest, but which is not stable version may cause update error
# detail on https://hub.docker.com/_/node/
FROM node:7

MAINTAINER Disciple.Ding <disciple.ding@gmail.com>

# Solve npm preinstall error
# https://github.com/npm/npm/issues/9863
RUN cd $(npm root -g)/npm \
 && npm install fs-extra --silent \
 && sed -i -e s/graceful-fs/fs-extra/ -e s/fs\.rename/fs.move/ ./lib/utils/rename.js

# Set app work directory
WORKDIR /usr/app

# Use the cache as long as contents of package.json hasn't changed.
COPY package.json /usr/app/
RUN npm install --silent

# Bundle app source
COPY . /usr/app

# Build Source
RUN npm run build

EXPOSE 8080

CMD [ "npm", "run", "start:server" ]

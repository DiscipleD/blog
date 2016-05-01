# can use node version tag like :onbuild, :latest, but which is not stable version may cause update error
# detail on https://hub.docker.com/_/node/
FROM node:6

# Create app directory
RUN mkdir -p /usr/app
WORKDIR /usr/app

# We add package.json first so that the  docker image build
# can use the cache as long as contents of package.json
# hasn't changed.

COPY package.json /usr/app/
RUN npm install

# Bundle app source
COPY . /usr/app

EXPOSE 80

RUN npm run build

CMD [ "npm", "run", "pm2" ]

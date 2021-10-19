FROM node:boron-alpine

ADD https://github.com/Yelp/dumb-init/releases/download/v1.1.1/dumb-init_1.1.1_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

EXPOSE 3000

# Set development environment as default
ENV NODE_ENV development

# Install eliza-wrapper Prerequisites
RUN npm install --quiet -g gulp yo mocha karma-cli pm2 && npm cache clean

RUN mkdir -p /opt/mean.js/public/lib
WORKDIR /opt/mean.js

COPY package.json /opt/mean.js/package.json
COPY cred.json /opt/mean.js/cred.json

RUN npm install

COPY . /opt/mean.js

# Run MEAN.JS server
# CMD npm install && npm start
CMD ["dumb-init", "npm", "run", "start"]

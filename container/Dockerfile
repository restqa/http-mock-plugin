FROM node:latest

COPY . /data
WORKDIR /data

RUN npm install --production

VOLUME /data

ENV OPENSSL_CONF=/dev/null

CMD ["node", "index.js"]


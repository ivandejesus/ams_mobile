# Image to generate production build
FROM node:10.14.1-alpine as build-prod
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .
RUN set -ex \
  && $(npm bin)/ng build \
    --prod

# Image for serving built resources on nginx
FROM nginx:alpine as app-prod
WORKDIR /usr/share/nginx/html
# Adds envsubst for use on environment substitution during startup
RUN apk add --update --no-cache --virtual .build_deps \
    gettext \
  && apk add --update --no-cache --virtual .run_deps \
    libintl \
  && cp /usr/bin/envsubst /usr/local/bin/envsubst \
  && apk del .build_deps
COPY config/entrypoint.sh /entrypoint.sh
RUN chmod a+x /entrypoint.sh
COPY --from=build-prod /app/dist/ams-mobile /usr/share/nginx/html
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

# Image for testing
FROM build-dev as app-test

RUN \
  echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories \
  && echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories \
  && echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories \
  && apk --no-cache  update \
  && apk add --no-cache --virtual .build-deps \
    gifsicle pngquant optipng libjpeg-turbo-utils \
    udev ttf-opensans chromium \
  && rm -rf /var/cache/apk/* /tmp/*

ENV CHROME_BIN /usr/bin/chromium-browser
ENV LIGHTHOUSE_CHROMIUM_PATH /usr/bin/chromium-browser

RUN  set -xe \
  && ng lint \
  && ng test 

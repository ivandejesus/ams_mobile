#!/usr/bin/env sh
set -ex

if [ "$AC66_API_URL" == "" ]; then { 
  echo "env var AC66_API_URL was not set....(at /home/deployer/.bashrc)";
  exit 1; 

} fi;

if [ "$AC66_WEBSOCKET_URL" == "" ]; then { 
  echo "env var AC66_WEBSOCKET_URL was not set...";
  exit 1; 

} fi;

if [ "$AC66_WEBSOCKET_REALM" == "" ]; then { 
  echo "env var AC66_WEBSOCKET_REALM was not set...";
  exit 1; 

} fi;

for f in $(find /usr/share/nginx/html -name main.*.js); do
  echo "Substituting $f with env vars on $f.tmp" \
  && envsubst '\$AC66_API_URL \$AC66_AMS_SIGN_IN_URL \$AC66_WEBSOCKET_URL \$AC66_WEBSOCKET_REALM \$AC66_ECOPAYZ_RETURN_URL \$AC66_ECOPAYZ_FAILURE_URL \$AC66_ECOPAYZ_CANCEL_URL \$AC66_FRESH_CHAT_TOKEN \$AC66_FRESH_CHAT_HOST' < $f > "$f.tmp" \
  && mv "$f.tmp" $f;
done

exec "$@"

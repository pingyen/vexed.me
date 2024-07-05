#!/usr/bin/env bash

cd $(dirname "$(dirname "$(dirname "$(realpath "$0")")")")

docker compose -f docker/compose/base.yml -f docker/compose/prod.yml run --rm certbot \
  certonly --keep --webroot --webroot-path=/var/www/certbot --email $1 --agree-tos --no-eff-email -d $2 -d www.$2

docker compose -f docker/compose/base.yml -f docker/compose/prod.yml exec nginx \
  nginx -s reload

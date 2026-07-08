#!/bin/bash
set -e

cp scripts/simple-app.service /etc/systemd/system/simple-app.service
systemctl daemon-reload

cp scripts/nginx-simple-app.conf /etc/nginx/conf.d/simple-app.conf

# Amazon Linux's default nginx.conf serves its own site on port 80; disable it
# so it doesn't conflict with the reverse-proxy vhost above.
if [ -f /etc/nginx/conf.d/default.conf ]; then
  rm -f /etc/nginx/conf.d/default.conf
fi

nginx -t

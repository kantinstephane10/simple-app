#!/bin/bash
set -e

# CodeDeploy does not guarantee the working directory is the deployment
# archive root when it invokes hook scripts, so resolve paths relative to
# this script's own location instead of relying on cwd.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cp "$SCRIPT_DIR/simple-app.service" /etc/systemd/system/simple-app.service
systemctl daemon-reload

cp "$SCRIPT_DIR/nginx-simple-app.conf" /etc/nginx/conf.d/simple-app.conf

# Amazon Linux's default nginx.conf serves its own site on port 80; disable it
# so it doesn't conflict with the reverse-proxy vhost above.
if [ -f /etc/nginx/conf.d/default.conf ]; then
  rm -f /etc/nginx/conf.d/default.conf
fi

nginx -t

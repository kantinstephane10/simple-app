#!/bin/bash
set -e

systemctl restart simple-app
systemctl restart nginx

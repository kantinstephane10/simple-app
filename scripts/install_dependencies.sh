#!/bin/bash
set -e

dnf install -y java-17-amazon-corretto nginx

systemctl enable nginx

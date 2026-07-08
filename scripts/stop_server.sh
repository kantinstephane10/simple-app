#!/bin/bash

if systemctl list-unit-files simple-app.service > /dev/null 2>&1; then
  systemctl stop simple-app || true
fi

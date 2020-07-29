#!/bin/sh

[ ! -f ./.pid ] && { echo "No PID file found."; exit 1; }

PID="$(cat ./.pid)"
kill "$PID"

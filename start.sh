#!/bin/sh
yarn install
yarn build

. ./.env

# Starting the bot.
PID="$(sh -c 'echo $$; exec yarn start 2>&1 >./.log' &)"
echo "$PID" > ./.pid


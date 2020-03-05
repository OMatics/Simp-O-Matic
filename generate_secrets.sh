#!/bin/sh

# This file outputs a `secrets.json` configuration to STDOUT,
#   provoiding you have exported the correct environment variables
#   holding the various API keys needed to run this bot.

cat <<- JSON
{
    "api": {
        "token": "$BOT_API_TOKEN"
    },
    "client": {
        "key": "$CLIENT_KEY",
        "id": "$CLIENT_ID"
    },

    "contextual": {
        "key": "$CONTEXTUAL_API_KEY"
    }
}
JSON

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

    "rapid": {
        "key": "$RAPID_API_KEY"
    },
    "oxford": {
        "id": "$OXFORD_ID",
        "key": "$OXFORD_KEY"
    },
    "google": {
        "api_key": "$GOOGLE_API_KEY",
        "search_id": "$GOOGLE_SEARCH_ID",
        "type": "$GOOGLE_TYPE",
        "project_id": "$GOOGLE_PROJECT_ID",
        "private_key_id": "$GOOGLE_PRIVATE_KEY_ID",
        "private_key": "$GOOGLE_PRIVATE_KEY",
        "client_email": "$GOOGLE_CLIENT_EMAIL",
        "client_id": "$GOOGLE_CLIENT_ID",
        "auth_uri": "$GOOGLE_AUTH_URI",
        "token_uri": "$GOOGLE_TOKEN_URI",
        "auth_provider_x509_cert_url": "$GOOGLE_AUTH_PROVIDER_X509_CERT_URL",
        "client_x509_cert_url": "$GOOGLE_CLIENT_X509_CERT_URL"
    },
    "yandex": {
        "geocoder": {
            "key": "$YANDEX_GEOCODER_KEY"
        }
    },
    "openweather": {
        "key": "$OPENWEATHER_KEY"
    },
    "darksky": {
        "key": "$DARKSKY_KEY"
    },
    "pastebin": {
        "key": "$PASTEBIN_KEY",
        "password": "$PASTEBIN_PASSWORD"
    }
}
JSON

# The Simp'O'Matic

## WIP

Currently most of the features in the `HELP.md` page, have not been
implemented.  Please my fren, if you have the time, send some pull
requests my way.

Yours, Sammy (in desperation for a nice FOSS-bot).

## Help / Bot-Commands

See [HELP.md](./HELP.md) file (keep in mind, that the file has
been formatted for better viewing through Discord, might look funky
with GitHub rendering).

## Getting Up & Running

Make sure you have `node` (`v10.x`) and `yarn` installed
(`npm` also possible).

- Clean up from previous build/install:
```sh
yarn clean
```
- Install dependencies:
```sh
yarn install
```
- Build/Compile files:
```sh
yarn build
```
- Run the bot locally:
```sh
yarn start
```

When starting the bot, you'll need your secrets set up (API keys etc.).

### Local Secrets

Make sure locally, you have the following secrets exported
as environment variables:
```sh
# Discord
export BOT_API_TOKEN="exampleExampleExample"
export CLIENT_KEY="exampleExampleExample"
export CLIENT_ID="exampleExampleExample"

# RapidAPI for Urban Dictionary and ContextualWeb
export RAPID_API_KEY="exampleExampleExample"

# Oxford English Dictionary
export OXFORD_ID="exampleExampleExample"
export OXFORD_KEY="exampleExampleExample"

# Google APIs
export GOOGLE_API_KEY="exampleExampleExample"
export GOOGLE_SEARCH_ID="exampleExampleExample"
export GOOGLE_OAUTH_ID="exampleExampleExample"
export GOOGLE_OAUTH_SECRET="exampleExampleExample"
export GOOGLE_PERSONAL_CODE="exampleExampleExample"
export GOOGLE_TYPE="exampleExampleExample"
export GOOGLE_PROJECT_ID="exampleExampleExample"
export GOOGLE_PRIVATE_KEY_ID="exampleExampleExample"
export GOOGLE_PRIVATE_KEY="exampleExampleExample"
export GOOGLE_CLIENT_EMAIL="exampleExampleExample"
export GOOGLE_CLIENT_ID="exampleExampleExample"
export GOOGLE_AUTH_URI="exampleExampleExample"
export GOOGLE_TOKEN_URI="exampleExampleExample"
export GOOGLE_AUTH_PROVIDER_X509_CERT_URL="exampleExampleExample"
export GOOGLE_CLIENT_X509_CERT_URL="exampleExampleExample"

# OpenWeather
export OPENWEATHER_KEY="exampleExampleExample"

# Pastebin
export PASTEBIN_KEY="exampleExampleExample"
export PASTEBIN_PASSWORD="exampleExampleExample"

```

I can send you the secrets file, if I _really_ trust you.

### Low on Space?
```sh
yarn --global-folder ./node_modules/ --cache-folder ./node_modules/
```

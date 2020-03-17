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
export BOT_API_TOKEN="exampleExampleExampleExample"
export RAPID_API_KEY="exampleExampleExampleExample"
export CLIENT_KEY="exampleExampleExampleExample"
export CLIENT_ID="exampleExampleExampleExample"
export OXFORD_ID="exampleExampleExampleExample"
export OXFORD_KEY="exampleExampleExampleExample"

export GOOGLE_API_KEY="exampleExampleExampleExample"
export GOOGLE_SEARCH_ID="exampleExampleExampleExample"
export GOOGLE_OAUTH_ID="exampleExampleExampleExample"
export GOOGLE_OAUTH_SECRET="exampleExampleExampleExample"
export GOOGLE_PERSONAL_CODE="exampleExampleExampleExample"
export GOOGLE_TYPE="exampleExampleExampleExample"
export GOOGLE_PROJECT_ID="exampleExampleExampleExample"
export GOOGLE_PRIVATE_KEY_ID="exampleExampleExampleExample"
export GOOGLE_PRIVATE_KEY="exampleExampleExampleExample"
export GOOGLE_CLIENT_EMAIL="exampleExampleExampleExample"
export GOOGLE_CLIENT_ID="exampleExampleExampleExample"
export GOOGLE_AUTH_URI="exampleExampleExampleExample"
export GOOGLE_TOKEN_URI="exampleExampleExampleExample"
export GOOGLE_AUTH_PROVIDER_X509_CERT_URL="exampleExampleExampleExample"
export GOOGLE_CLIENT_X509_CERT_URL="exampleExampleExampleExample"
```

I can send you the tokens file, if I _trust_ you.

### Low on Space?
```sh
yarn --global-folder ./node_modules/ --cache-folder ./node_modules/
```

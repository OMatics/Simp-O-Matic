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

Make sure you have `node` (`v12.x`) and `yarn`installed
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
yarn run
```
- Or deploy it with `now`:
```sh
yarn deploy
```

In both cases (`deploy` or `start`) you'll need your secrets set up
(API keys etc.).

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
```

### Now Deployment Secrets

`now` has a `secrets` functionality, which will store your secrets, and
export them as environment variables, for your `now`, you can do:
```sh
now secrets add discord-bot-api-token "$BOT_API_TOKEN"
now secrets add rapid-api-key "$RAPID_API_KEY"
now secrets add discord-client-key "$CLIENT_KEY"
now secrets add discord-client-id "$CLIENT_ID"
now secrets add oxford-dictionary-id "$OXFORD_ID"
now secrets add oxford-dictionary-key "$OXFORD_KEY"
```
For some context, have a look in `./now.json`.

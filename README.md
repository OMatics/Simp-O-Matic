# The Simp'O'Matic

<p align="center">
  <img width="300" src="lib/resources/banners/banner-FFFFFF.png">
</p>

## Help Out

Currently some of the features in the `HELP.md` page, have not yet been
implemented.  Please my friend, if you have the time, send some pull
requests our way.

Yours, [Sammy](https://github.com/Demonstrandum), [Danny](https://github.com/danyisill), [Accelarion](https://github.com/Accelarion) and [Bruno](https://github.com/0-l).

## Why is it objectively superior

Let's compare it to a similar discord bot, [moiph/ub3r-b0t](https://github.com/moiph/ub3r-b0t)

![Screenshot 2020-03-21 at 4 15 0](https://user-images.githubusercontent.com/23189912/77216413-3084d980-6b2b-11ea-8efe-e952dd7a1cb5.png)
![Screenshot 2020-03-21 at 4 14 34](https://user-images.githubusercontent.com/23189912/77216414-31b60680-6b2b-11ea-8360-17113b5919bf.png)

Ub3r bot was added to the server 3 years ago, and Simp'o'Matic was only added 3 days ago, yet it had already overtaken it by the number of messages! On average it was used almost every minute, while ub3r bot was only used every few hours, so it's great for increasing user activity

— Danny

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

## Dependencies / Project Structure?

[This graph](http://npm.broofa.com/?q=simp-o-matic) should sort that right out for you.

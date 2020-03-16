#!/bin/sh

bold="$(tput bold)"
reset="$(tput sgr0)"

[ ! -d "./node_modules" ] && echo "${bold}Installing...${reset}" && yarn install
rm -rf ./build
mkdir -p ./build ./public

echo "${bold}Copying config files...${reset}"
cp ./bot.json ./generate_secrets.sh ./HELP.md ./build

echo "${bold}Compiling TypeScript...${reset}"
./node_modules/.bin/tsc -b ./tsconfig.json


[ -f "./export_secrets.sh" ] && source ./export_secrets.sh

echo -e "\n${bold}Build done.${reset}"

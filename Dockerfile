FROM node:16-alpine

# Dependencies
RUN apk add --update nodejs git ffmpeg espeak yarn python3

# Prepare /app
RUN mkdir /app
WORKDIR /app
COPY package.json yarn.lock .git /app/

# --- Build and run ---
RUN mkdir -p /app/build /app/public
# Choose which .env to use.
COPY .env.DEBUG /app/.env
COPY heart.png generate_secrets.sh HELP.md lib \
	clone_nocheckout.sh tsconfig.json tslint.json \
	web bot.json /app/
# Install deps
COPY lib/drug-o-matic /app/lib/drug-o-matic
RUN yarn install
# Build
RUN cp /app/bot.json /app/generate_secrets.sh /app/HELP.md /app/package.json /app/build/
RUN /app/node_modules/.bin/tsc -b /app/tsconfig.json

# Run
ENTRYPOINT ["sh", "-c", "source /app/.env && \"$@\"", "-s"]
# Kill with `docker stop` for a graceful shutdown (saving configs, etc.)
# or use `docker kill` to not follow the bot's shutdown procedur.
CMD ["node", "."]

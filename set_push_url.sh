#!/bin/sh

GIT="$(command -v git)"
[ -z "$GIT" ] && { echo "Please install \`git\` to your PATH."; exit 1; }

URL="git@git.knutsen.co:/srv/git/Simp-O-Matic.git"
"$GIT" remote set-url --push --add origin "$URL"


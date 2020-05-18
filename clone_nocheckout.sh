#!/bin/sh

rm -rf ./tmp ./.git

git clone \
	--no-checkout \
	https://github.com/Demonstrandum/Simp-O-Matic.git \
	./tmp

mv ./tmp/.git ./.git


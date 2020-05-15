#!/bin/sh
set -e
npm run build

echo "\ntesting..."
npm run test

printf "\n \e[92mAll good! \o/ 🐶\n"

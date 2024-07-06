#!/bin/bash -x

welcome() {
clear
echo ' _____  _____  _____  _____  _____  _   _  _____  '
echo '|_   _||  ___|/  ___||_   _||_   _|| \ | ||  __ \ '
echo '  | |  | |__  \ `--.   | |    | |  |  \| || |  \/ '
echo '  | |  |  __|  `--. \  | |    | |  | . ` || | __  '
echo '  | |  | |___ /\__/ /  | |   _| |_ | |\  || |_\ \ '
echo '  \_/  \____/ \____/   \_/   \___/ \_| \_/ \____/ '
echo
}

run() {
  "$PWD"/node_modules/.bin/mocha \
  -b \
  --compilers coffee:coffee-script/register \
  --require should \
  --reporter spec \
  --timeout 120000 \
  --slow 300 \
  "$@"
}

## Main
welcome && run \
test/test.coffee



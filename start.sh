#!/bin/bash
source /usr/local/share/nvm/nvm.sh
nvm use 20
./node_modules/.bin/next dev -H 0.0.0.0

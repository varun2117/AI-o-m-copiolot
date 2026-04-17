#!/bin/bash
source /usr/local/share/nvm/nvm.sh
nvm use 20
npm run dev -- -H 0.0.0.0 > next.log 2>&1 &
sleep 5
cat next.log

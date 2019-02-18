#!/bin/bash
cd ../ && EOS=$(pwd) && cd scripts/

. ./restartChain.sh
# . $EOS/scripts/compile.sh
sleep 1.5s
. ./accounts.sh
sleep 0.5s
. ./tokenSetup.sh
echo Finished

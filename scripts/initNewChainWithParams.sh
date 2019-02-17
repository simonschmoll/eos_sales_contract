#!/bin/bash
cd ../ && EOS=$(pwd) && cd scripts/

. $EOS/scripts/restartChain.sh
# . $EOS/scripts/compile.sh
sleep 1.5s
. $EOS/scripts/accounts.sh
sleep 0.5s
. $EOS/scripts/token_setup.sh
echo Finished

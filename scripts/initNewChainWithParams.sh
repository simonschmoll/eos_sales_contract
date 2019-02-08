#!/bin/bash
. $EOS/salescon/scripts/restartChain.sh
. $EOS/salescon/scripts/compile.sh
. $EOS/salescon/scripts/accounts.sh
sleep 0.5s
. $EOS/salescon/scripts/token_setup.sh
echo Finished

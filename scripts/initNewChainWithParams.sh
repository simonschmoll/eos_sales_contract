#!/bin/bash
cd ../ && EOS=$(pwd) && cd scripts/

. ./restartChain.sh
# . $EOS/scripts/compile.sh

. ./accounts.sh
. ./tokenSetup.sh
echo Finished

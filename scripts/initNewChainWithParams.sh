#!/bin/bash
cd ../../ && EOS=$(pwd) && cd eos_sales_contract/scripts

. $EOS/eos_sales_contract/scripts/restartChain.sh
# . $EOS/eos_sales_contract/scripts/compile.sh
sleep 1.5s
. $EOS/eos_sales_contract/scripts/accounts.sh
sleep 0.5s
. $EOS/eos_sales_contract/scripts/token_setup.sh
echo Finished

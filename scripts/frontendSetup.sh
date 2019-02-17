#!/bin/bash
cd ../../ && EOS=$(pwd) && cd eos_sales_contract/scripts
. $EOS/eos_sales_contract/scripts/restartChain.sh
. $EOS/eos_sales_contract/scripts/compile.sh
. $EOS/eos_sales_contract/scripts/accounts.sh
cleos create account eosio salescon EOS8EXyGVLjxTPyaZyEqJDzthx1SPNec3g13MgcYbNQTLv9KC5wkL
sleep 0.5s
. $EOS/eos_sales_contract/scripts/token_setup.sh
. $EOS/eos_sales_contract/scripts/contractSetup.sh
cleos push action salescon init '["seller", "buyer", "intermed"]' -p seller@active

echo Finished
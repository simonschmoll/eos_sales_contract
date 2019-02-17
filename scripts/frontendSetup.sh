#!/bin/bash
cd ../ && EOS=$(pwd) && cd scripts/
. $EOS/scripts/restartChain.sh
. $EOS/scripts/compile.sh
. $EOS/scripts/accounts.sh
cleos create account eosio salescon EOS8EXyGVLjxTPyaZyEqJDzthx1SPNec3g13MgcYbNQTLv9KC5wkL
sleep 0.5s
. $EOS/scripts/token_setup.sh
. $EOS/scripts/contractSetup.sh
cleos push action salescon init '["seller", "buyer", "intermed"]' -p seller@active

echo Finished
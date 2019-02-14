#!/bin/bash
. $EOS/salescon/scripts/restartChain.sh
. $EOS/salescon/scripts/compile.sh
. $EOS/salescon/scripts/accounts.sh
cleos create account eosio salescon EOS8EXyGVLjxTPyaZyEqJDzthx1SPNec3g13MgcYbNQTLv9KC5wkL
sleep 0.5s
. $EOS/salescon/scripts/token_setup.sh
. $EOS/salescon/scripts/contractSetup.sh
cleos push action salescon init '["seller", "buyer", "intermed"]' -p seller@active

echo Finished
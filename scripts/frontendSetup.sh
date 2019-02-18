#!/bin/bash
cd ../ && EOS=$(pwd) && cd scripts/
. restartChain.sh
sleep 1.5s
# . $EOS/scripts/compile.sh
. ./accounts.sh
cleos create account eosio salescon EOS8EXyGVLjxTPyaZyEqJDzthx1SPNec3g13MgcYbNQTLv9KC5wkL
sleep 0.5s
. ./tokenSetup.sh
. ./contractSetup.sh
cleos push action salescon init '["seller", "buyer", "intermed"]' -p seller@active

echo Finished
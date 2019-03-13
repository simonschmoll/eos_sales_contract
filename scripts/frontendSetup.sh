#!/bin/bash
cd ../ && EOS=$(pwd) && cd scripts/
. restartChain.sh
# . $EOS/scripts/compile.sh
. ./accounts.sh
cleos create account eosio salescon EOS8EXyGVLjxTPyaZyEqJDzthx1SPNec3g13MgcYbNQTLv9KC5wkL
. ./tokenSetup.sh
cleos set account permission salescon active --add-code
# . ./contractSetup.sh
# cleos push action salescon init '["seller", "buyer", "intermed"]' -p seller@active

echo Finished
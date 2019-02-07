#!/bin/bash
sh $EOS/salescon/scripts/restartChain.sh
# wait $!
sh $EOS/salescon/scripts/compile.sh
# wait $!
# Sleep is necessary because nodeos and keosd are not yet ready
# sleep 1.5s
sh $EOS/salescon/scripts/accounts.sh
sleep 0.5s
sh $EOS/salescon/scripts/token_setup.sh
# sh $EOS/salescon/scripts/contractSetup.sh
wait $!
echo Finished
# remove later

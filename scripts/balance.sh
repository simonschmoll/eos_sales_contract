#/bin/bash
echo salescon 
cleos get currency balance eosio.token salescon EOS
echo buyer
cleos get currency balance eosio.token buyer EOS
echo seller
cleos get currency balance eosio.token seller EOS
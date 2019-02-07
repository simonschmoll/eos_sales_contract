#/bin/bash
echo salescon 
cleos get currency balance eosio.token salescon SYS
echo buyer
cleos get currency balance eosio.token buyer SYS
echo seller
cleos get currency balance eosio.token seller SYS
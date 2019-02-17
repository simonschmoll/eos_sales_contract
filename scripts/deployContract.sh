#!/bin/bash
CONTRACTNAME=$1
cd ../../ && EOS=$(pwd) && cd eos_sales_contract/scripts
cleos create account eosio $CONTRACTNAME EOS8EXyGVLjxTPyaZyEqJDzthx1SPNec3g13MgcYbNQTLv9KC5wkL

cleos set contract $CONTRACTNAME $EOS/eos_sales_contract/salescon -p $CONTRACTNAME
cleos set account permission $CONTRACTNAME active --add-code

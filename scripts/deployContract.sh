#!/bin/bash
CONTRACTNAME=$1

cleos create account eosio $CONTRACTNAME EOS8EXyGVLjxTPyaZyEqJDzthx1SPNec3g13MgcYbNQTLv9KC5wkL

cleos set contract $CONTRACTNAME $EOS/salescon -p $CONTRACTNAME
cleos set account permission $CONTRACTNAME active --add-code

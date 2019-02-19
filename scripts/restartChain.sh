#!/bin/bash
pkill nodeos & pkill keosd
rm -r $EOS/eosio/data/*
rm -r $EOS/eosio/config/*
rm -r nodeos.log
nohup keosd &>/dev/null &
. ./nodeosStart.sh
while [ ! -f nodeos.log ]; do
    sleep 0.2s
done

until grep -q "produce_block" "nodeos.log"; do
    sleep 0.2s
done





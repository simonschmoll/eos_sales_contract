#!/bin/bash

pkill nodeos & pkill keosd
rm -rf $EOS/eosio/data/*
nohup keosd &>/dev/null &
sh $EOS/eos_sales_contract/scripts/nodeosStart.sh


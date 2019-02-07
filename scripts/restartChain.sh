#!/bin/bash

pkill nodeos & pkill keosd
rm -rf $EOS/eosio/data/*
nohup keosd &>/dev/null &
sh $EOS/salescon/scripts/nodeosStart.sh


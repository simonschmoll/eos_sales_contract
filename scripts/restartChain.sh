#!/bin/bash

pkill nodeos & pkill keosd
rm -r $EOS/eosio/data/*
nohup keosd &>/dev/null &
. $EOS/scripts/nodeosStart.sh


#!/bin/bash
pkill nodeos & pkill keosd
rm -r $EOS/eosio/data/*
nohup keosd &>/dev/null &
. ./nodeosStart.sh


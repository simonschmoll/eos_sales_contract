#!/bin/bash

pkill nodeos && pkill keosd
rmtrash $EOS/eosio/data/*

sh $EOS/nodeosStart.sh
keosd &


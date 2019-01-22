#!/bin/bash

pkill nodeos && pkill keosd
rmtrash $EOS/eosio/data/*

sh ../nodeosStart.sh
keosd &


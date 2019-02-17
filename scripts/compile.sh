#!/bin/bash

cd ../salescon
eosio-cpp -o salescon.wasm salescon.cpp --abigen
cd ../scripts
#!/bin/bash

# Mixed commands for faster dev work

eosio-cpp -o salescon.wasm salescon.cpp --abigen
cleos set contract salescon /Users/simonthesis/Desktop/EosDevelopment/salescon -p salescon@active
cleos push action salescon setitem '["seller", "asd", 123, false, false]' -p buyer@active
cleos push action salescon init '["seller", "buyer", "intermed"]' -p seller@active

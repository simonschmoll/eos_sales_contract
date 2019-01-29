#!/bin/bash

cleos push action salescon init '["seller", "buyer", "intermed"]' -p seller@active
cleos push action salescon setitem '["asd", 123]' -p seller@active
cleos push action salescon itemreceived '[]' -p buyer@active

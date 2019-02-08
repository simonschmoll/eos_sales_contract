#!/bin/bash
cleos push action salescon retract '[ "seller" ]' -p seller@active
if [ $? -eq 0 ]; then
    echo OK
else
    exit 1
fi
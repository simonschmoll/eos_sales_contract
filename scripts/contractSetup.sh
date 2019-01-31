#!/bin/bash

cleos set contract salescon $EOS/salescon -p salescon
cleos set account permission salescon active --add-code

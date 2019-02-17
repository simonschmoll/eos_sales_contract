#!/bin/bash

cleos set contract salescon $EOS/eos_sales_contract/salescon -p salescon
cleos set account permission salescon active --add-code

PUBLICKEY=EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV

cleos create account eosio eosio.ram $PUBLICKEY
cleos create account eosio eosio.token $PUBLICKEY
cleos create account eosio eosio.stake $PUBLICKEY
cleos create account eosio eosio.ramfee $PUBLICKEY

cleos set contract eosio.token $EOS/eosio.contracts/eosio.token/ -p eosio.token
cleos push action eosio.token create '[ "eosio", "1000000000.0000 SYS"]' -p eosio.token

cleos push action eosio.token issue '["seller", "1000.0000 SYS", "memo"]' -p eosio@active 
cleos push action eosio.token issue '["buyer", "1000.0000 SYS", "memo"]' -p eosio@active 
cleos push action eosio.token issue '["intermed", "1000.0000 SYS", "memo"]' -p eosio@active
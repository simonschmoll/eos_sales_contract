#!/bin/bash

echo "PW5K5upnuvVKh1XXZHzz7f7qFoMN4DNoZZHUvvQXaHAX7HNprxMtM" | cleos wallet unlock
echo "PW5JqXfgydSH6bBiFxe4UkbfD7eA7era1RH6a3wcur4BKcMi3jTm4" | cleos wallet unlock -n seller
echo "PW5Junm5wtvNNG1mumKt3KAatSMUDfhUod1U6nZx9u3FNQLWL4Sox" | cleos wallet unlock -n buyer
echo "PW5KZeJbo1QGbxQCrQEhrvLHpLEGrWXuwJCLFe8BTmRc7xADiHnGw" | cleos wallet unlock -n intermed

cleos create account eosio seller EOS6s4muTgTasZJcnuvhuFDhAQ7bjrkoHy8DZKfjKFvXrEY6KoQpj
cleos create account eosio buyer EOS8AW7wZVzBHAFo7Dun7khQ9EiHmYzkw2XBEkon6CfesgqCcWWxT
cleos create account eosio intermed EOS8bZnFP4nkhPCFP45hQKpJ8RWMen1qq4qdsbe5WvoWVbtAxAAvG
cleos create account eosio random EOS8EXyGVLjxTPyaZyEqJDzthx1SPNec3g13MgcYbNQTLv9KC5wkL
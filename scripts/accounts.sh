#!/bin/bash


cat pw.txt | cleos wallet unlock

cleos create account eosio seller EOS8EXyGVLjxTPyaZyEqJDzthx1SPNec3g13MgcYbNQTLv9KC5wkL
cleos create account eosio buyer EOS8EXyGVLjxTPyaZyEqJDzthx1SPNec3g13MgcYbNQTLv9KC5wkL
cleos create account eosio intermed EOS8EXyGVLjxTPyaZyEqJDzthx1SPNec3g13MgcYbNQTLv9KC5wkL
cleos create account eosio random EOS8EXyGVLjxTPyaZyEqJDzthx1SPNec3g13MgcYbNQTLv9KC5wkL
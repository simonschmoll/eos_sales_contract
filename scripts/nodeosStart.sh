#!/bin/bash
nodeos -e -p eosio \
--plugin eosio::producer_plugin \
--plugin eosio::chain_api_plugin \
--plugin eosio::http_plugin \
--plugin eosio::history_plugin \
--plugin eosio::history_api_plugin \
--data-dir $EOS/eosio/data \
--config-dir $EOS/eosio/config \
--access-control-allow-origin='*' \
--contracts-console \
--http-validate-host=false \
--verbose-http-errors \
--filter-on='*' >> nodeos.log 2>&1 &


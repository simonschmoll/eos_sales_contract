#!/bin/bash

sh restartChain.sh
wait $!
sh accounts.sh
sh token_setup.sh
sh contractSetup.sh

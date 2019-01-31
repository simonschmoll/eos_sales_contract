#!/bin/bash

sh compile.sh
wait $!
sh accounts.sh
sh token_setup.sh
sh contractSetup.sh
wait $!
# remove later
sh performActions.sh
sh transfer.sh
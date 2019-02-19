#!/bin/bash

# chmod 700 accounts.sh
# chmod 700 compile.sh
# chmod 700 contractSetup.sh
# chmod 700 deployContract.sh
# chmod 700 initNewChainWithParams.sh
# chmod 700 nodeosStart.sh
# chmod 700 restartChain.sh
# chmod 700 tokenSetup.sh

nohup keosd &>/dev/null &
if [ ! -f pw.txt ]; then
  echo "File not found"
  cleos wallet create --file pw.txt
  cleos wallet import --private-key 5K8ghcBf9TpPAWdxHDUejqcxBWrQAzkj5D5FWHe13nmNJmWhH9k
  cleos wallet import --private-key 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3
  cleos wallet import --private-key 5KFcKixjbRQsfq9cQ8YXsV6GHEHqaiRrfGLevnM9AqUw5L1PmKC
fi
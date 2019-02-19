#!/bin/bash

nohup keosd &>/dev/null &

if [ ! -f pw.txt ]; then
  cleos wallet create --file pw.txt
  cleos wallet import --private-key 5K8ghcBf9TpPAWdxHDUejqcxBWrQAzkj5D5FWHe13nmNJmWhH9k
  cleos wallet import --private-key 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3
  cleos wallet import --private-key 5KFcKixjbRQsfq9cQ8YXsV6GHEHqaiRrfGLevnM9AqUw5L1PmKC
fi
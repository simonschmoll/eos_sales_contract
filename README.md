# Eos Sales Contract

**DISCLAIMER: This smart contract setup is not intended for production use, rather as a experimental setup 
to facilitate the understanding of EOS and the underlying principles. DO NOT USE this code in production or deploy it 
to the main network, as any EOS locked into the contract might be exposed to security risks. The code was not audited and 
should only be used for educational purposes.**

## Local setup

## Prerequisites:

### 1. Operating System
You need to use either Linux or MacOs to interact with the contract as the eosio software currently does not support the operating system Windows. It is possible to enable linux as a subsystem in Windows. 
However, the following guide is aimed at Linux and MacOs systems. 
If you are using Windows you can get started here (https://medium.com/@blockgenic/eosio-single-node-testnet-setup-on-windows-ae7a59900e69).

### 2. NPM
You need to have npm installed to work with this implementation.  
It is recommended to use a node version manager such as nvm  (https://github.com/creationix/nvm) to install npm

### 3. Eosio, keosd, cleos and nodeos
Please follow the steps 1.1 - 1.5 of the tutorials from the developer portal of EOS and install eosio, keosd and nodeos. Link: https://developers.eos.io/eosio-home/docs/introduction  
**Do not create the default wallet and test accounts from step 1.6 and 1.7 as they will be created automatically in the next step**

<!-- ### 4. Script setup
Unfortunately, there is also some bash configs which need to be established. As there is currently no local test suit available for EOS. The instructions are as follows:
- Open a terminal and navigate into the scripts directory (from root this is: `cd scripts`)
- Next run the command `chmod 700 oneTimeSetup.sh` (this will allow you to execute the setup script)
- After this, type `./oneTimeSetup.sh` into the terminal (this will run the initialization script - every command must be executed in **scripts** directory)
- There should be no warnings in the console after executing the script, if there are please try to fix the errors by troubleshooting. Otherwise, you are not able to run the contract locally. 

(**Remark: This script will make other scripts executable which are necessary for the tests, furthermore it will create a default wallet)**   -->

<!-- Quick command guide (from eos_contract_sales):  
`cd scripts`  
`chmod 700 oneTimeSetup.sh`  
`./oneTimeSetup.sh`  
 -->

### 4. Install all necessary dependencies and run custom script
From the root directory (eos_sales_contract) run: 
`npm install` 
The complete script should run without problems (no error messages), otherwise there will be problems later on!  
(**Remark: This command will install all dependencies and it will run a setup script which makes other scripts executable, these necessary for the tests, furthermore it will create a default wallet. The password for the default wallet will be stored in scripts/pw.txt you only need it if you want to unlock it manually)** 
## Start the Tests
**Only after all previous steps (prerequisites 1-4 and npm install)**  
From the root directory (eos_sales_contract) run:  
`npm test`

## Start the Frontend

**Only after all previous steps (prerequisites 1-4 and npm install)**  
From the root directory (eos_sales_contract) run:  
`npm start`  
This will initialize a new eos chain (nodeos) and delete any previous data. 
The contract is now ready for interaction. But before, it is necessary to install scatter.

### Install Scatter  

To interact with the smart contract on the EOS Blockchain download the wallet provider Scatter (https://get-scatter.com/). Please follow the next steps:
- Start Scatter after downloading it
- Create a new wallet
- Import the private key for interaction (private key: 5K8ghcBf9TpPAWdxHDUejqcxBWrQAzkj5D5FWHe13nmNJmWhH9k)
- After importing the private key scatter should show you 5 accounts (seller, buyer, intermed, salescon, random)

Now go to http://localhost:8082 and you can interact with the contract.

### Intended steps for interaction: 
- Set Item
- Pay Item
- Received Item
- Withdraw

Everytime a button is clicked, Scatter will ask you for the permission.




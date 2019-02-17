# Eos Sales Contract

## Local setup

## Prerequisites:
**MANDATORY:** You need to use either Linux or MacOs to interact with the contract as the eosio software currently does not support the operating system Windows. It is possible to enable linux as a subsystem in Windows. 
However the following guide is aimed at Linux and MacOs systems. 
If you are using Windows you can get started here (https://medium.com/@blockgenic/eosio-single-node-testnet-setup-on-windows-ae7a59900e69).

### NPM
You need to have npm installed to work with this implementation.  
It is recommended to use a node version manager such as nvm  (https://github.com/creationix/nvm) to install npm

### Eosio, keosd and nodeos
Please follow the steps 1.1 - 1.7 of the tutorials from the developer portal of EOS and install eosio, keosd and nodeos. Link: https://developers.eos.io/eosio-home/docs/introduction


<!-- ## Set your working directory of EOS as an environment variable
Create a new directory where you want to clone or download this github repository to. Next, set this directory as an environment variable with the name EOS.
Example: You created an directory with this path: /Users/yourUserName/Desktop/EosDevelopment, now open a terminal and run the command:  
`export EOS=/Users/yourUserName/Desktop/EosDevelopment` (use your directory path after the '=' symbol and not this example), then you navigate into this directory and call git clone or you download the repository from github and unzip it into this directory. To verify that you created the environment variable type: 
`echo $EOS` in the terminal. This step is necessary as many initialization scripts take this environment variable as the root directory. -->


## Start the Tests
From the root directory (eos_sales_contract) run:  
`npm install && test`

## Start the Frontend
From the root directory (eos_sales_contract) run:  
`npm install && start`  

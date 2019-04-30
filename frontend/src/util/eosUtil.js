import eos from './eos';
import rpcModule from './rpcModule';
import wasm from './wasm';
import abi from './abi';


let deployName;

async function send(account, actionName, data, wallet) {
  console.log('Wallet and account in Send: ', wallet, account);
  if (wallet.authenticated === false) {
    console.log('Need to login again from Send function');

    await wallet.connect();
    await wallet.login();
  }
  return wallet.eosApi
    .transact({
      actions: [
        {
          account,
          name: actionName,
          authorization: [
            {
              actor: wallet.auth.accountName,
              permission: wallet.auth.permission,
            },
          ],
          data,
        },
      ],
    },
    {
      broadcast: true,
      blocksBehind: 3,
      expireSeconds: 60,
    });
}


async function init(data, contractName) {
  console.log('init function util');
  const wallet = await eos.getSellerWallet();
  return send(contractName, 'init', data, wallet);
}

async function deploy() {
  const wallet = await eos.getDeployWallet();

  deployName = wallet.auth.accountName;
  console.log('wasm', wasm.wasm);
  console.log('abi', abi.abi);
  const account = wallet.auth.accountName;
  return wallet.eosApi.transact(
    {
      actions: [
        {
          account: 'eosio',
          name: 'setcode',
          authorization: [
            {
              actor: wallet.auth.accountName,
              permission: 'active',
            },
          ],
          data: {
            account,
            vmtype: 0,
            vmversion: 0,
            code: wasm.toString(),
          },
        },
        {
          account: 'eosio',
          name: 'setabi',
          authorization: [
            {
              actor: wallet.auth.accountName,
              permission: 'active',
            },
          ],
          data: {
            account,
            abi: abi.toString(),
          },
        },
      ],
    },
    {
      blocksBehind: 3,
      expireSeconds: 30,
    },
  );
}

function getContractName() {
  return deployName;
}

async function setItem(item, contractName = 'salescon') {
  console.log('In Set Item', item);
  const wallet = await eos.getSellerWallet();
  console.log('Wallet in setItem', wallet);

  return send(contractName, 'setitem', item, wallet);
}

async function pay(price, contractName) {
  console.log('Pay called');
  const wallet = await eos.getBuyerWallet();
  const data = {
    from: wallet.auth.accountName,
    to: contractName,
    quantity: price,
    memo: '',
  };
  return send('eosio.token', 'transfer', data, wallet);
}

const changeSeller = async (newSeller, contractName) => {
  const wallet = await eos.getSellerWallet();
  return send(contractName, 'changeseller', { newSeller }, wallet);
};

const retractSeller = async (from, contractName) => {
  const wallet = await eos.getSellerWallet();
  return send(contractName, 'retract', { retractor: from }, wallet);
};
const retractIntermed = async (from, buyerIsRight, contractName) => {
  const wallet = await eos.getIntermedWallet();
  return send(contractName, 'finalretract', { retractor: from, buyerIsRight }, wallet);
};
const retractBuyer = async (from, contractName) => {
  const wallet = await eos.getBuyerWallet();
  return send(contractName, 'retract', { retractor: from }, wallet);
};

const itemReceived = async (contractName) => {
  const wallet = await eos.getBuyerWallet();
  return send(contractName, 'itemreceived', {}, wallet);
};

const withdrawBuyer = async (account, contractName) => {
  const wallet = await eos.getBuyerWallet();
  console.log('Withdraw buyer wallet', wallet);

  return send(contractName, 'withdraw', { to: account.toString() }, wallet);
};

const withdrawSeller = async (account, contractName) => {
  const wallet = await eos.getSellerWallet();
  console.log('Withdraw wallet', wallet);
  console.log('Withdraw account', account, contractName);

  return send(contractName, 'withdraw', { to: account.toString() }, wallet);
};

const getRowsSaleCon = async (table, contractName) => rpcModule.rpc.get_table_rows({
  json: true,
  code: contractName,
  scope: contractName,
  table,
  limit: 10,
});

const getContractData = async (contractName) => {
  const config = getRowsSaleCon('config', contractName);
  const agreement = getRowsSaleCon('agreement', contractName);
  const item = getRowsSaleCon('item', contractName);
  return Promise.all([config, agreement, item]).then((value) => {
    // console.log(value);
    let name;
    let price;
    if (value[2].rows.length < 1) {
      name = '';
      price = 0;
    } else {
      name = value[2].rows[0].itemName;
      price = value[2].rows[0].itemPrice;
    }
    const data = {
      retracted: value[0].rows[0].contractRetracted,
      agreement: {
        sellerRetract: value[1].rows[0].sellerRetract,
        buyerRetract: value[1].rows[0].buyerRetract,
        intermediatorRetract: value[1].rows[0].intermediatorRetract,
      },
      balance: value[0].rows[0].balance,
      seller: value[0].rows[0].seller,
      buyer: value[0].rows[0].buyer,
      itemSet: value[0].rows[0].itemSet,
      intermediator: value[0].rows[0].intermediator,
      contractClosed: value[0].rows[0].contractIsClosed,
      buyerIsPaidBack: value[0].rows[0].buyerIsPaidBack,
      item: {
        itemPaid: value[0].rows[0].itemPaid,
        itemReceived: value[0].rows[0].itemReceived,
        name,
        price,
      },
    };
    return data;
  });
};

export default {
  getContractName,
  init,
  deploy,
  setItem,
  send,
  withdrawBuyer,
  withdrawSeller,
  pay,
  changeSeller,
  retractSeller,
  retractBuyer,
  retractIntermed,
  itemReceived,
  getRowsSaleCon,
  getContractData,
};

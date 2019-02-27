import eos from './eos';
import rpcModule from './rpcModule';

async function send(account, actionName, data, wallet) {
  console.log('Wallet in Send: ', wallet);
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

function getContractName() {
  return 'salescon';
}

async function setItem(item) {
  console.log('In Set Item', item);
  const wallet = await eos.getSellerWallet();
  console.log('Wallet in setItem', wallet);

  return send(getContractName(), 'setitem', item, wallet);
}

async function pay(price) {
  console.log('Pay called');
  const wallet = await eos.getBuyerWallet();
  const data = {
    from: wallet.auth.accountName,
    to: getContractName(),
    quantity: price,
    memo: '',
  };
  return send('eosio.token', 'transfer', data, wallet);
}

const changeSeller = async newSeller => send(getContractName(), 'changeseller', { newSeller });

const retractSeller = async (from) => {
  const wallet = await eos.getSellerWallet();
  return send(getContractName(), 'retract', { retractor: from }, wallet);
};
const retractIntermed = async (from, buyerIsRight) => {
  const wallet = await eos.getIntermedWallet();
  return send(getContractName(), 'finalretract', { retractor: from, buyerIsRight }, wallet);
};
const retractBuyer = async (from) => {
  const wallet = await eos.getBuyerWallet();
  return send(getContractName(), 'retract', { retractor: from }, wallet);
};

const itemReceived = async () => {
  const wallet = await eos.getBuyerWallet();
  return send(getContractName(), 'itemreceived', {}, wallet);
};

const withdrawBuyer = async (account) => {
  const wallet = await eos.getBuyerWallet();
  console.log('Withdraw buyer wallet', wallet);

  return send(getContractName(), 'withdraw', { to: account.toString() }, wallet);
};

const withdrawSeller = async (account) => {
  const wallet = await eos.getSellerWallet();
  console.log('Withdraw wallet', wallet);

  return send(getContractName(), 'withdraw', { to: account.toString() }, wallet);
};

const getRowsSaleCon = async (table) => {
  const contractName = getContractName();
  return rpcModule.rpc.get_table_rows({
    json: true,
    code: contractName,
    scope: contractName,
    table,
    limit: 10,
  });
};

const getContractData = async () => {
  const config = getRowsSaleCon('config');
  const agreement = getRowsSaleCon('agreement');
  const item = getRowsSaleCon('item');
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

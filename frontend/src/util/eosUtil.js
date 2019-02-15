// import getEos from './getEos';
import eos from './eos';
import getRpc from './getEos';

async function send(account, actionName, data, wallet) {
  // await eos.terminateWallet();

  // console.log('wallet is', wallet);

  // await wallet.connect();
  // await wallet.login('buyer');
  // // eslint-disable-next-line
  // await wallet.provider.login("buyer");

  console.log('Wallet in Send: ', wallet);
  // console.log('Wallet permission ', eos.wallet.auth.permission);
  // console.log('Wallet accountname: ', eos.wallet.auth.accountName);
  // console.log('Wallet rpc: ', eos.wallet.ctx.eosRpc);
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
  // .then((result) => {
  //   console.log('Transaction success!', result);
  //   return result;
  // })
  // .catch((error) => {
  //   console.error('Transaction error :(', error);
  //   throw error;
  // });
}

function getContractName() {
  return 'salescon';
}

async function setItem(item) {
  console.log('In Set Item');
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
  send(getContractName(), 'retract', { retractor: from }, wallet);
};
const retractIntermed = async (from) => {
  const wallet = await eos.getIntermedWallet();
  send(getContractName(), 'retract', { retractor: from }, wallet);
};
const retractBuyer = async (from) => {
  const wallet = await eos.getBuyerWallet();
  send(getContractName(), 'retract', { retractor: from }, wallet);
};

const itemReceived = async () => {
  const wallet = await eos.getBuyerWallet();
  send(getContractName(), 'itemreceived', {}, wallet);
};

const withdraw = async (account) => {
  const wallet = await eos.getSellerWallet();
  console.log('Withdraw wallet', wallet);

  send(getContractName(), 'withdraw', { to: account.toString() }, wallet);
};

const getRowsSaleCon = async (table) => {
  const contractName = getContractName();
  return getRpc.rpc.get_table_rows({
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


// async function itemReceived(contractInstance) {
//   console.log('Default account in item received', window.web3.eth.defaultAccount);
//   return contractInstance.methods.itemReceived()
//     .send({ from: window.web3.eth.defaultAccount });
// }

// async function payItem(contractInstance, price) {
//   console.log('Paying called in webutil', price);
//   return contractInstance.methods.payItem()
//     .send({ from: window.web3.eth.defaultAccount, value: price });
// }

// async function withdraw(contractInstance) {
//   console.log('Withdraw called in webutil');
//   return contractInstance.methods.withdraw()
//     .send({ from: window.web3.eth.defaultAccount });
// }

// async function withdrawAfterDisputeBuyer(contractInstance) {
//   console.log('Withdraw after dispute called in webutil by buyer');
//   return contractInstance.methods.withdrawAfterRetractionByBuyer()
//     .send({ from: window.web3.eth.defaultAccount });
// }

// async function withdrawAfterDisputeSeller(contractInstance) {
//   console.log('Withdraw after dispute called in webutil by seller');
//   return contractInstance.methods.withdrawAfterRetractionBySeller()
//     .send({ from: window.web3.eth.defaultAccount });
// }

// async function retractContract(contractInstance) {
//   console.log('Withdraw called in webutil');
//   return contractInstance.methods.retractContract()
//     .send({ from: window.web3.eth.defaultAccount });
// }

// async function getAgreement(contract) {
//   console.log('getAgreement called in web3util');
//   return contract.methods.getAgreement().call();
// }

// async function getBalance(contract) {
//   console.log('getAgreement called in web3util');
//   return contract.methods.getContractBalance().call();
// }


// function watchEvents(contractInstance) {
//   contractInstance.getPastEvents('SetItem', {
//     fromBlock: 0,
//     toBlock: 'latest',
//   })
//     .then((events) => {
//       console.log(events);
//     });
// }

export default {
  // getAccount,
  // deployContract,
  // loadContractData,
  // loadContract,
  setItem,
  send,
  withdraw,
  pay,
  changeSeller,
  retractSeller,
  retractBuyer,
  retractIntermed,
  itemReceived,
  getRowsSaleCon,
  getContractData,
  // itemReceived,
  // loadExistingContract,
  // payItem,
  // withdraw,
  // getAgreement,
  // retractContract,
  // getBalance,
  // withdrawAfterDisputeBuyer,
  // withdrawAfterDisputeSeller,
};

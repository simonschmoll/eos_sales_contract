const { Api, JsonRpc } = require('eosjs');
const JsSignatureProvider = require('eosjs/dist/eosjs-jssig').default;  // development only
const fetch = require('node-fetch');                            // node only; not needed in browsers
const { TextDecoder, TextEncoder } = require('text-encoding');  // node, IE11 and IE Edge Browsers
const shell = require('shelljs');

const privateKeys = ['5K8ghcBf9TpPAWdxHDUejqcxBWrQAzkj5D5FWHe13nmNJmWhH9k'];

const signatureProvider = new JsSignatureProvider(privateKeys);
const rpc = new JsonRpc('http://127.0.0.1:8888', { fetch });
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

const bike = {
  itemName: "bike", 
  itemPrice: 100000
}
let contractName = '';

exports.getApi = () => api;
exports.send = async (account, actionName, actor, permission, data, nonce = 'asd') => {  
  await api.transact({
    actions: [{
      account,
      name: actionName,
      authorization: [{
        actor,
        permission,
      }],
        data
    }]
  }, {
    blocksBehind: 0,
    expireSeconds: 0.5,
  });
  // console.dir(result);
};

function getTransferData (from, contractName, memo, quantity = '10.0000 SYS') {
  return {
    from,
    to: contractName,
    quantity,
    memo
  }
}

exports.pay = async (from) => {
  const memo = Math.random().toString(36).substring(3);
  await exports.send('eosio.token', 'transfer', from, 'active', getTransferData(from, exports.getContractName(), memo));
}

exports.setItem = async (from, item = bike) => {
  await exports.send(exports.getContractName(), 'setitem', from, 'active', item);
}

exports.changeSeller = async (from, newSeller) => {
  await exports.send(exports.getContractName(), 'changeseller', from, 'active', { newSeller });
}

exports.retract = async (from, retractor) => {
  await exports.send(exports.getContractName(), 'retract', from , 'active', { retractor });
}

exports.itemReceived = async (from) => {
  await exports.send(exports.getContractName(), 'itemreceived', from , 'active', {});
}

exports.withdraw = async (from) => {
  await exports.send(exports.getContractName(), 'withdraw', from , 'active', { to:from });
}

exports.getContractName = () => contractName;
exports.changeContractName = () => contractName = generateRandomName();
  
exports.beforeEach = async() => {
  return new Promise((resolve, reject) => {
    exports.changeContractName();
    const contractName = exports.getContractName();
    console.log(contractName);
    shell.exec(`../scripts/deployContract.sh ${contractName}` , async (code, stdout, stderr) => {
      console.log(contractName)
      try {
        await exports.send(contractName, 'init', 'seller', 'active', initData);
      } catch(error) {
        console.log(error);
        reject();
      }
      resolve();
    });
  });
}

exports.before = async() => {
  return new Promise((resolve) => {
    shell.exec('../scripts/initNewChainWithParams.sh', (code, stdout, stderr) => {
      resolve();
    });
    console.log('Calling before');
  })
}

function generateRandomName() {
  let result = "";
  const possible = "12345abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < 10; i++)
    result += possible.charAt(Math.floor(Math.random() * possible.length));
  return result;
}
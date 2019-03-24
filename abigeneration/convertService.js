const { Api, JsonRpc } = require('eosjs');
const JsSignatureProvider = require('eosjs/dist/eosjs-jssig').default;  // development only
const fetch = require('node-fetch');                            // node only; not needed in browsers
const { TextDecoder, TextEncoder } = require('text-encoding');  // node, IE11 and IE Edge Browsers
const shell = require('shelljs');
const fs = require(`fs`)
const path = require(`path`)
const { Serialize } = require(`eosjs`)

const privateKeys = ['5K8ghcBf9TpPAWdxHDUejqcxBWrQAzkj5D5FWHe13nmNJmWhH9k'];

const signatureProvider = new JsSignatureProvider(privateKeys);
const rpc = new JsonRpc('http://127.0.0.1:8888', { fetch });
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });


function getDeployableFilesFromDir(dir) {
  const dirCont = fs.readdirSync(dir)
  const wasmFileName = dirCont.find(filePath => filePath.match(/.*\.(wasm)$/gi))
  const abiFileName = dirCont.find(filePath => filePath.match(/.*\.(abi)$/gi))
  if (!wasmFileName) throw new Error(`Cannot find a ".wasm file" in ${dir}`)
  if (!abiFileName) throw new Error(`Cannot find an ".abi file" in ${dir}`)
  return {
    wasmPath: path.join(dir, wasmFileName),
    abiPath: path.join(dir, abiFileName),
  }
}

exports.deployContract = async (contractDir) => {
  const { wasmPath, abiPath } = getDeployableFilesFromDir(contractDir)

  // 1. Prepare SETCODE
  // read the file and make a hex string out of it
  const wasm = fs.readFileSync(wasmPath).toString(`hex`)

  // 2. Prepare SETABI
  const buffer = new Serialize.SerialBuffer({
    textEncoder: api.textEncoder,
    textDecoder: api.textDecoder,
  })

  let abi = JSON.parse(fs.readFileSync(abiPath, `utf8`))
  const abiDefinition = api.abiTypes.get(`abi_def`)
  // need to make sure abi has every field in abiDefinition.fields
  // otherwise serialize throws
  abi = abiDefinition.fields.reduce(
    (acc, { name: fieldName }) =>
      Object.assign(acc, { [fieldName]: acc[fieldName] || [] }),
    abi
  )
  abiDefinition.serialize(buffer, abi)

  fs.writeFileSync('abiNew.js', Buffer.from(buffer.asUint8Array()).toString(`hex`))
  fs.writeFileSync('wasmNew.js', wasm.toString(wasm))
};

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

function getTransferData (from, contractName, memo, quantity = '10.0000 EOS') {
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

exports.retract = async (from) => {
  await exports.send(exports.getContractName(), 'retract', from , 'active', { retractor: from });
}

exports.finalretract = async (from, buyerIsRight) => {
  await exports.send(exports.getContractName(), 'finalretract', from , 'active', { buyerIsRight });
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
    shell.exec(`../scripts/deployContract.sh ${contractName}`, {silent:true} , async (code, stdout, stderr) => {
      if(code !== 0) {
        reject();
      }
      try {
        await exports.send(contractName, 'init', 'seller', 'active', initData);
      } catch(error) {
        console.log('Error in init of contract:', error);
        reject();
      }
      resolve();
    });
  });
}

exports.before = async() => {
  return new Promise((resolve, reject) => {
    shell.exec('../scripts/initNewChainWithParams.sh', {silent:true}, (code, stdout, stderr) => {
      if(code !== 0) {
        reject();
      }
      resolve();
    });
    console.log('Calling before');
  })
}

exports.getRowsSaleCon = async (table) => { 
  let contractName = exports.getContractName();
  return rpc.get_table_rows({
    json: true,             
    code: contractName,    
    scope: contractName,         
    table: table,     
    limit: 10       
  });
}

exports.getRowsGeneral = async (contractName, scope,  tableName) => { 
  return rpc.get_table_rows({
    json: true,             
    code: contractName,    
    scope,         
    table: tableName,     
    limit: 10       
  });
}

function generateRandomName() {
  let result = "";
  const possible = "12345abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < 10; i++)
    result += possible.charAt(Math.floor(Math.random() * possible.length));
  return result;
}


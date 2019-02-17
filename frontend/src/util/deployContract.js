import eos from './eos';

const { TextDecoder, TextEncoder } = require('text-encoding');

// const wasm = require('./salescon.wasm');
// const fs = require('fs');
// const path = require('path');
const { Serialize } = require('eos-transit/node_modules/eosjs');
// function getDeployableFilesFromDir(dir) {
//   const dirCont = fs.readdirSync(dir);
//   const wasmFileName = dirCont.find(filePath => filePath.match(/.*\.(wasm)$/gi));
//   const abiFileName = dirCont.find(filePath => filePath.match(/.*\.(abi)$/gi));
//   if (!wasmFileName) throw new Error(`Cannot find a ".wasm file" in ${dir}`);
//   if (!abiFileName) throw new Error(`Cannot find an ".abi file" in ${dir}`);
//   return {
//     wasmPath: path.join(dir, wasmFileName),
//     abiPath: path.join(dir, abiFileName),
//   };
// }

async function deployContract() {
  const wallet = await eos.getSellerWallet();
  console.log('eos', wallet);

  const api = wallet.eosApi;
  // const { wasmPath, abiPath } = getDeployableFilesFromDir(contractDir);

  // 1. Prepare SETCODE
  // read the file and make a hex string out of it
  const wasmBuffer = await fetch('./salescon.wasm')
    .then((res) => {
      if (res.ok) {
        return res.arrayBuffer();
      }
      throw new Error('Unable to fetch WASM.');
    })
    .then((bytes) => {
      console.log('Bytes', Buffer.from(bytes));
      return Buffer.from(bytes);
    });

  console.log('wasm buffer', wasmBuffer);
  // const wasm = fs.readFileSync('./salescon.wasm').toString('hex');

  // // 2. Prepare SETABI
  // const buffer = new Serialize.SerialBuffer({
  //   textEncoder: new TextEncoder(),
  //   textDecoder: new TextDecoder(),
  // });

  const abiBuffer = await fetch('./salescon.abi')
    .then((res) => {
      if (res.ok) {
        return res.arrayBuffer();
      }
      throw new Error('Unable to fetch abi.');
    })
    .then((bytes) => {
      console.log('Bytes abi', bytes);
      return JSON.parse(Buffer.from(bytes).asUint8Array());
    });

  let abiJson = await api.rawAbiToJson(abiBuffer);

  const abiDefinition = api.abiTypes.get('abi_def');
  // need to make sure abi has every field in abiDefinition.fields
  // otherwise serialize throws
  abiJson = abiDefinition.fields.reduce(
    (acc, { name: fieldName }) => Object.assign(acc, { [fieldName]: acc[fieldName] || [] }),
    abiJson,
  );

  const buffer = new Serialize.SerialBuffer({
    textEncoder: new TextEncoder(),
    textDecoder: new TextDecoder(),
  });
  abiDefinition.serialize(buffer, abiJson);
  // let abi = JSON.parse(fs.readFileSync('./salescon.abi', 'utf8'));
  // // let abi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
  // const abiDefinition = api.abiTypes.get('abi_def');
  // // need to make sure abi has every field in abiDefinition.fields
  // // otherwise serialize throws
  // abi = abiDefinition.fields.reduce(
  //   (acc, { name: fieldName }) => Object.assign(acc, { [fieldName]: acc[fieldName] || [] }),
  //   abi,
  // );
  // abiDefinition.serialize(buffer, abi);
  // // 3. Send transaction with both setcode and setabi actions
  return api.transact(
    {
      actions: [
        {
          account: 'eosio',
          name: 'setcode',
          authorization: [
            {
              actor: wallet.auth.accountName,
              permission: wallet.auth.permission,
            },
          ],
          data: {
            account: wallet.auth.accountName,
            vmtype: 0,
            vmversion: 0,
            code: wasmBuffer,
          },
        },
        {
          account: 'eosio',
          name: 'setabi',
          authorization: [
            {
              actor: wallet.auth.accountName,
              permission: wallet.auth.permission,
            },
          ],
          data: {
            account: wallet.auth.accountName,
            abi: Buffer.from(buffer.asUint8Array()).toString('hex'),
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

export default {
  deployContract,
};

import abi from '!raw-loader!./salescon.abi';
// import wasm from '!raw-loader!./salescon.txt';
import eos from './eos';

const { TextDecoder, TextEncoder } = require('text-encoding');
const { Serialize } = require('eos-transit/node_modules/eosjs');

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => (`00${x.toString(16)}`).slice(-2)).join('');
}

async function deployContract() {
  const wallet = await eos.getSellerWallet();
  console.log('eos', wallet);

  const api = wallet.eosApi;

  const wasmBuffer = await fetch('./salescon.wasm')
    .then((res) => {
      if (res.ok) {
        return res.arrayBuffer();
      }
      throw new Error('Unable to fetch WASM.');
    })
    .then((bytes) => {
      console.log('Bytes', bytes);
      return buf2hex(bytes);
    });

  console.log('wasm buffer', wasmBuffer);

  // wasmBuffer = Buffer.from(wasmBuffer.data);
  // console.log('Abi from import', abi);

  const abiBuffer = await fetch('./salescon.abi')
    .then((res) => {
      if (res.ok) {
        return res.arrayBuffer();
      }
      throw new Error('Unable to fetch abi.');
    })
    .then((bytes) => {
      console.log('Bytes abi', Buffer.from(bytes));
      return Buffer.from(bytes);
    });

  // let abiJson = await api.rawAbiToJson(abi); // can not convert abi to json
  // abiBuffer = abiBuffer.toString('utf8');
  const abiDefinition = api.abiTypes.get('abi_def');
  let abiJson = JSON.parse(abi.toString('hex'));
  console.log(abiJson);

  abiJson = abiDefinition.fields.reduce(
    (acc, { name: fieldName }) => Object.assign(acc, { [fieldName]: acc[fieldName] || [] }),
    abiJson,
  );

  console.log('Abi json is', abiJson);
  const buffer = new Serialize.SerialBuffer({
    textEncoder: new TextEncoder(),
    textDecoder: new TextDecoder(),
  });
  abiDefinition.serialize(buffer, abiJson);
  console.log('Abi after ser', Buffer.from(buffer.asUint8Array()).toString('hex'));
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
            account: 'seller',
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
            account: 'seller',
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

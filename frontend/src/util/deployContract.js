import eos from './eos';

const { TextDecoder, TextEncoder } = require('text-encoding');
const { Serialize } = require('eos-transit/node_modules/eosjs');


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
      console.log('Bytes', Buffer.from(bytes));
      return Buffer.from(bytes);
    });

  console.log('wasm buffer', wasmBuffer);

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

  // let abiJson = await api.rawAbiToJson(abiBuffer); // can not convert abi to json

  const abiDefinition = api.abiTypes.get('abi_def');

  abiJson = abiDefinition.fields.reduce(
    (acc, { name: fieldName }) => Object.assign(acc, { [fieldName]: acc[fieldName] || [] }),
    abiJson,
  );

  const buffer = new Serialize.SerialBuffer({
    textEncoder: new TextEncoder(),
    textDecoder: new TextDecoder(),
  });
  abiDefinition.serialize(buffer, abiJson);

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

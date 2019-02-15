// import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';

const { JsonRpc } = require('eos-transit/node_modules/eosjs');

const fetch = require('node-fetch'); // node only; not needed in browsers
// const { TextDecoder, TextEncoder } = require('text-encoding'); // node, IE11 and IE Edge Browsers

// const privateKeys = ['5K8ghcBf9TpPAWdxHDUejqcxBWrQAzkj5D5FWHe13nmNJmWhH9k'];

// const signatureProvider = new JsSignatureProvider(privateKeys);
const rpc = new JsonRpc('http://127.0.0.1:8888', { fetch });
// const api = new Api({
//   rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder(),
// });

export default {
  rpc,
};

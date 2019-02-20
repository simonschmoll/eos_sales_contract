const { JsonRpc } = require('eos-transit/node_modules/eosjs');
const fetch = require('node-fetch'); // node only; not needed in browsers

const rpc = new JsonRpc('http://127.0.0.1:8888', { fetch });

export default {
  rpc,
};

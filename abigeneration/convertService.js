// Based on https://cmichel.io/setcode-and-setabi-with-eos-js/

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


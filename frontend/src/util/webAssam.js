import wasm from './salescon.wasm';

const extractModule = async (module) => {
  const { instance } = await module();
  return instance.exports;
};
const wasmModule = extractModule(wasm);

export default {
  wasmModule,
};

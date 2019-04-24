import { initAccessContext } from 'eos-transit';
import scatter from 'eos-transit-scatter-provider';

let sellerWallet;
let buyerWallet;
let intermedWallet;
let deployWallet;
const walletProvidersConf = [
  scatter(),
];
const network = {
  host: '127.0.0.1',
  port: 8888,
  protocol: 'http',
  chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
};

const initBuyerWallet = async () => {
  const accessContextBuyer = initAccessContext({
    appName: 'Sales Contract - Buyer',
    network,
    walletProviders: walletProvidersConf,
  });
  const walletProviders = accessContextBuyer.getWalletProviders();
  const selectedProvider = walletProviders[0];
  buyerWallet = await accessContextBuyer.initWallet(selectedProvider);
  console.log('In Init buyer wallet');

  await buyerWallet.connect();
  await buyerWallet.login();
};

const initIntermedWallet = async () => {
  const accessContextIntermed = initAccessContext({
    appName: 'Sales Contract - Intermed',
    network,
    walletProviders: walletProvidersConf,
  });
  const walletProviders = accessContextIntermed.getWalletProviders();
  const selectedProvider = walletProviders[0];
  intermedWallet = await accessContextIntermed.initWallet(selectedProvider);
  await intermedWallet.connect();
  await intermedWallet.login();
};


const initSellerWallet = async () => {
  const accessContextSeller = initAccessContext({
    appName: 'Sales Contract - Seller',
    network,
    walletProviders: walletProvidersConf,
  });
  const walletProviders = accessContextSeller.getWalletProviders();
  const selectedProvider = walletProviders[0];
  sellerWallet = await accessContextSeller.initWallet(selectedProvider);
  await sellerWallet.connect();
  await sellerWallet.login();
};

const initDeployWallet = async () => {
  const accessContextDeploy = initAccessContext({
    appName: 'Sales Contract - Deploy',
    network,
    walletProviders: walletProvidersConf,
  });
  const walletProviders = accessContextDeploy.getWalletProviders();
  const selectedProvider = walletProviders[0];
  deployWallet = await accessContextDeploy.initWallet(selectedProvider);
  await deployWallet.connect();
  await deployWallet.login();
};

const getSellerWallet = async () => {
  console.log('getSellerWallet beginning');
  if (sellerWallet === undefined) {
    await initSellerWallet();
    console.log('Init Seller Wallet ', sellerWallet);
  } else {
    await sellerWallet.terminate();
    await initSellerWallet();
  }
  console.log('getSellerWallet init after undefinded check');
  if (sellerWallet.authenticated === false) {
    await sellerWallet.login();
  }
  return sellerWallet;
};

const getBuyerWallet = async () => {
  console.log('Buyer Wallet: ', buyerWallet);

  if (buyerWallet === undefined) {
    await initBuyerWallet();
    console.log('Init Buyer Wallet ', buyerWallet);
  } else {
    await buyerWallet.terminate();
    await initBuyerWallet();
  }
  if (buyerWallet.authenticated === false) {
    await buyerWallet.login();
  }
  return buyerWallet;
};

const getIntermedWallet = async () => {
  if (intermedWallet === undefined) {
    await initIntermedWallet();
    console.log('Init Intermed Wallet ', intermedWallet);
  } else {
    await intermedWallet.terminate();
    await initIntermedWallet();
  }
  if (intermedWallet.authenticated === false) {
    await intermedWallet.login();
  }
  return intermedWallet;
};

const getDeployWallet = async () => {
  if (deployWallet === undefined) {
    await initDeployWallet();
    console.log('Init deploy Wallet ', deployWallet);
  } else {
    await deployWallet.terminate();
    await initDeployWallet();
  }
  if (deployWallet.authenticated === false) {
    await deployWallet.login();
  }
  return deployWallet;
};


export default {
  getSellerWallet,
  getIntermedWallet,
  getBuyerWallet,
  getDeployWallet,
};

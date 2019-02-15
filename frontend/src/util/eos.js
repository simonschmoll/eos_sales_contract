import { initAccessContext } from 'eos-transit';
import scatter from 'eos-transit-scatter-provider';

// We need to initialize the so called "access context" first,
// passing it our dapp name, network configuration and
// providers we want to make available to the dapp.
// The context is responsible for initializing wallet connectoins
// and tracking state of connected wallets.

// We're using our own test network as an example here.
let sellerWallet;
let buyerWallet;
let intermedWallet;
const walletProvidersConf = [
  scatter(),
];
const network = {
  host: '127.0.0.1',
  port: 8888,
  protocol: 'http',
  chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
};
// When user selects the wallet provider, we initiate the `Wallet` with it:
// const wallet = accessContext.initWallet(selectedProvider);

const initBuyerWallet = async () => {
  const accessContextBuyer = initAccessContext({
    appName: 'Buyer',
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
    appName: 'Intermed',
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
    appName: 'Seller',
    network,
    walletProviders: walletProvidersConf,
  });
  const walletProviders = accessContextSeller.getWalletProviders();
  const selectedProvider = walletProviders[0];
  sellerWallet = await accessContextSeller.initWallet(selectedProvider);
  await sellerWallet.connect();
  await sellerWallet.login();
};

const getSellerWallet = async () => {
  console.log('getSellerWallet beginning');
  if (sellerWallet === undefined) {
    await initSellerWallet();
    console.log('Init Seller Wallet ', sellerWallet);
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
  }
  if (intermedWallet.authenticated === false) {
    await intermedWallet.login();
  }
  return intermedWallet;
};


export default {
  getSellerWallet,
  getIntermedWallet,
  getBuyerWallet,
};

// Now we have an instance of `wallet` that is tracked by our `accessContext`.
// Lets connect to it and authenticate (you need Scatter app running)
// NOTE: Only use `await` inside the `async` function, its used here just to
// highlight that its asynchronous.


// wallet.connected === true

// Now that we are connected, lets authenticate (in case of a Scatter app,
// it does it right after connection, so this is more for the state tracking
// and for WAL to fetch the EOS account data for us)

// wallet.authenticated === true
// wallet.auth === { accountName: 'some_user', permission: 'active', publicKey: '...' }
// wallet.accountInfo === { name: 'some_user', core_liquid_balance: ..., ram_quota: ..., etc... }

// Now that we have a wallet that is connected, logged in and have account data available,
// you can use it to sign transactions using the `eosjs` API instance that is automatically
// created and maintained by the wallet:

// const eosAmount = 10;

// wallet.eosApi
//   .transact({
//     actions: [
//       {
//         account: 'eosio.token',
//         name: 'transfer',
//         authorization: [
//           {
//             actor: wallet.auth.accountName,
//             permission: wallet.auth.permission
//           }
//         ],
//         data: {
//           from: wallet.auth.accountName,
//           to: 'receiving_user',
//           quantity: `${eosAmount.toFixed(4)} EOS`,
//           memo: ''
//         }
//       }
//     ]
//   },
//   {
//     broadcast: true,
//     blocksBehind: 3,
//     expireSeconds: 60
//   }
// )
// .then(result => {
//   console.log('Transaction success!', result);
//   return result;
// })
// .catch(error => {
//   console.error('Transaction error :(', error);
//   throw error;
// });

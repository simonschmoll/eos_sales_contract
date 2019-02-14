import { initAccessContext } from 'eos-transit';
import scatter from 'eos-transit-scatter-provider';

// We need to initialize the so called "access context" first,
// passing it our dapp name, network configuration and
// providers we want to make available to the dapp.
// The context is responsible for initializing wallet connectoins
// and tracking state of connected wallets.

// We're using our own test network as an example here.
const accessContext = initAccessContext({
  appName: 'Babo',
  network: {
    host: '127.0.0.1',
    port: 8888,
    protocol: 'http',
    chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
  },
  walletProviders: [
    scatter(),
  ],
});

// We're all set now and can get the list of available wallet providers
// (we only have Scatter provider configured, so there will be only one):
const walletProviders = accessContext.getWalletProviders();
/* [{
 *   id: 'scatter',
 *   meta: {
 *    name: 'Scatter Desktop',
 *    shortName: 'Scatter',
 *    description: 'Scatter Desktop application that keeps your private keys secure'
 *   },
 *   signatureProvider,
 *   ... etc
 * }]
 */

// This list can be used to, e.g., show the "login options" to the user to let him choose
// what EOS login method he wants to use.

// We just take the one we have as if the user has selected that
const selectedProvider = walletProviders[0];

// When user selects the wallet provider, we initiate the `Wallet` with it:
const wallet = accessContext.initWallet(selectedProvider);

(async () => {
  await wallet.connect();
  // await wallet.login();
})();

export default { wallet };

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

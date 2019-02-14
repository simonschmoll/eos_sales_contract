import eosUtil from '../../util/eosUtil';
import getEos from '../../util/getEos';
import wallet from '../../util/eos';
import eos from '../../util/eos';
// import deploy from '../../util/deployContract';

export default {
  state: {
    contractInstance: null,
    contractState: {
      retracted: false,
      agreement: {
        sellerRetract: false,
        buyerRetract: false,
        intermediatorRetract: false,
      },
      balance: null,
      seller: null,
      buyer: null,
      intermediator: null,
      contractClosed: false,
      buyerIsPaidBack: false,
      item: {
        name: '',
        price: 0,
        itemPaid: false,
        itemReceived: false,
      },
    },
    web3Instance: null,
  },
  actions: {
    async loadInitialData({ state, commit }) {
      console.log('wallet', wallet);

      // const test = await eosUtil.send('salescon', 'setitem', {
      //   itemName: 'bike',
      //   itemPrice: 100000,
      // })
      //   .then((result) => {
      //     console.log('Transaction success!', result);
      //     return result;
      //   })
      //   .catch((error) => {
      //     console.error('Transaction error :(', error);
      //     throw error;
      //   });
      // console.log('test --', test);
      console.log('Loading InitialData');

      // Deploy contract data when good option is available
      // const result = await deploy.deployContract({ account: 'eosio', contractDir: '../../../' });
      // console.log('Result is', result);
      state.contractInstance = eos.wallet;
      const config = eosUtil.getRowsSaleCon('config');
      const agreement = eosUtil.getRowsSaleCon('agreement');
      const item = eosUtil.getRowsSaleCon('item');
      Promise.all([config, agreement, item]).then((value) => {
        console.log(value);
        let itemName;
        let itemPrice;
        if (value[2].rows.length < 1) {
          itemName = '';
          itemPrice = 0;
        } else {
          itemName = value[2].rows[0].itemName;
          itemPrice = value[2].rows[0].itemPrice;
        }
        const data = {
          retracted: value[0].rows[0].contractRetracted,
          agreement: {
            sellerRetract: value[1].rows[0].sellerRetract,
            buyerRetract: value[1].rows[0].buyerRetract,
            intermediatorRetract: value[1].rows[0].intermediatorRetract,
          },
          balance: value[0].rows[0].balance,
          seller: value[0].rows[0].seller,
          buyer: value[0].rows[0].buyer,
          intermediator: value[0].rows[0].intermediator,
          contractClosed: value[0].rows[0].contractIsClosed,
          buyerIsPaidBack: value[0].rows[0].buyerIsPaidBack,
          item: {
            itemPaid: value[0].rows[0].itemPaid,
            itemReceived: value[0].rows[0].itemReceived,
            itemName,
            itemPrice,
          },
        };
        commit('loadInitialData', data);
      });
      // const contractInstanceLocal = state.contractInstance;

      // // TODO: just for testing, connect to existing contract
      // // contractInstanceLocal =
      // // await eosUtil.loadExistingContract('0x2313A1f6A8EF84b3320761aF1f8298B84229D09D');
      // // console.log('contract Instance in loadInitData action', contractInstanceLocal);
      // // state.contractInstance = contractInstanceLocal;

      // if (contractInstanceLocal) {
      //   console.log('Loading contract data (action) if condition (init)');
      //   eosUtil.loadContractData(
      //     contractInstanceLocal, state.contractState,
      //   ).then((result) => { commit('loadInitialData', result); });
      //   // commit('loadInitialData', await eosUtil.loadContractData(
      //   //   contractInstanceLocal, state.contractState,
      //   // ));
      // }
    },
    async loadContractData({ state, commit }) {

      // console.log('Loading contract data (action)');
      // if (state.contractInstance) {
      //   console.log('Loading contract data (action) if condition');
      //   eosUtil.loadContractData(state.contractInstance, state.contractState)
      //     .then((result) => { commit('saveContractData', result); });
      // }
    },
    async setItem({ state, commit }, { name, price }) {
      console.log('Set Item mutation called');
      eosUtil.setItem('seller', { itemName: name, itemPrice: price })
        .then(() => {
          commit('setItem', { name, price });
        });
    },
    async receivedItem({ state, commit }) {
      // eosUtil.itemReceived(state.contractInstance)
      //   .then(() => commit('receivedItem'));
    },
    async deploy({ commit, dispatch }, { seller, buyer, intermediator }) {
      // console.log('mutation deploy called in store', seller, buyer, intermediator);
      // eosUtil.deployContract(seller, buyer, intermediator)
      //   .then((instance) => {
      //     commit('saveContract', instance);
      //     dispatch('loadInitialData');
      //   });
    },
    async pay({ dispatch, state }, price) {
      // eosUtil.payItem(state.contractInstance, price)
      //   .then(() => dispatch('loadBalance'));
    },
    async loadBalance({ commit, state }) {
      // eosUtil.getBalance(state.contractInstance)
      //   .then((balance) => {
      //     commit('pay');
      //     commit('updateBalance', balance);
      //   });
    },
    async withdraw({ commit, state }) {
      // eosUtil.withdraw(state.contractInstance)
      //   .then(() => commit('withdraw'));
    },
    async retract({ dispatch, state }) {
      // eosUtil.retractContract(state.contractInstance)
      //   .then(() => dispatch('loadContractData'));
    },
    async withdrawAfterDisputeBuyer({ dispatch, state }) {
      // eosUtil.withdrawAfterDisputeBuyer(state.contractInstance)
      //   .then(() => dispatch('loadContractData'));
    },
    async withdrawAfterDisputeSeller({ dispatch, state }) {
      // eosUtil.withdrawAfterDisputeSeller(state.contractInstance)
      //   .then(() => dispatch('loadContractData'));
    },
    // async getAgreement({ commit, state }) {
    //   eosUtil.getAgreement(state.contractInstance)
    //     .then((result) => { commit('updateAgreement', result); });
    // },
  },
  getters: {
    getItem: state => state.contractState.item,
    getStatus: state => state.contractState.contractClosed,
    getAgreement: state => state.contractState.agreement,
    getBuyerIsPaidBack: state => state.contractState.buyerIsPaidBack,
    getBalance: state => state.contractState.balance,
  },
  mutations: {
    saveContract(state, payload) {
      console.log('deploy mutation contract instance =', payload);
      state.contractInstance = payload;
    },
    receivedItem(state) {
      console.log('Received action called');
      state.contractState.item = Object.assign(
        {}, state.contractState.item, { itemReceived: true },
      );
    },
    setItem(state, { name, price }) {
      state.contractState.item = Object.assign({}, state.contractState.item, { name, price });
      console.log('New item state after setting item in mutation', state.contractState.item);
    },
    loadInitialData(state, payload) {
      state.contractState = payload;
      // state.web3.currentAccount = window.web3.eth.defaultAccount;
      console.log('Intial Contract State: ', payload);
    },
    saveContractData(state, payload) {
      console.log('Saving contract Data (mutation)');
      state.contractState = payload;
    },
    pay(state) {
      state.contractState.item = Object.assign({}, state.contractState.item, { itemPaid: true });
      console.log('Changing state of item after payment in mutations');
    },
    withdraw(state) {
      console.log('Contract is now closed');
      state.contractState.contractClosed = true;
      console.log('ContractStatus', state.contractClosed);
    },
    updateBalance(state, payload) {
      console.log('Updating Balance:', payload);
      state.contractState.balance = payload;
    },
    // updateAgreement(state, payload) {
    //   console.log(`Contract retracted by ${payload} retracted!`);
    //   state.contractState.agreement = Object.assign({}, payload);
    // },
  },
};

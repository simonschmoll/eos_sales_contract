import eosUtil from '../../util/eosUtil';
import getRpc from '../../util/getEos';
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

    async pollContract({ commit }) {
      const data = await eosUtil.getContractData();
      // console.log('Data is: ', data);
      commit('loadData', data);
    },

    async loadData({ state, commit }) {
      console.log('Loading InitialData');
      state.contractInstance = getRpc;
      const data = await eosUtil.getContractData();
      commit('loadData', data);
    },
    async setItem({ commit }, { name, price }) {
      console.log('Set Item mutation called');
      await eosUtil.setItem({ itemName: name, itemPrice: price });
    },

    async pay({ state, commit }, price) {
      console.log('Pay in store called', price);

      await eosUtil.pay(price);
    },

    async receivedItem({ commit }) {
      await eosUtil.itemReceived();
    },
    async deploy({ commit, dispatch }, { seller, buyer, intermediator }) {
      // console.log('mutation deploy called in store', seller, buyer, intermediator);
      // eosUtil.deployContract(seller, buyer, intermediator)
      //   .then((instance) => {
      //     commit('saveContract', instance);
      //     dispatch('loadData');
      //   });
    },

    async loadBalance({ commit, state }) {
      // eosUtil.getBalance(state.contractInstance)
      //   .then((balance) => {
      //     commit('pay');
      //     commit('updateBalance', balance);
      //   });
    },
    async withdraw({ commit, state }) {
      console.log('State is', state);

      eosUtil.withdraw(state.contractState.seller)
        .then(async () => {
          const data = await eosUtil.getContractData();
          commit('loadData', data);
        });
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
    loadData(state, payload) {
      state.contractState = payload;
    },
  },
};

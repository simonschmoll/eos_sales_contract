import eosUtil from '../../util/eosUtil';

/* eslint-disable */
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
      const data = await eosUtil.getContractData();
      commit('loadData', data);
    },
    async setItem({ commit }, { name, price }) {
      console.log('Set Item mutation called', price);
      console.log('Price index', (price.indexOf('.') > -1));
      console.log('decimal places', (price + '.').split('.')[1].length )
      const isDecimal = price.indexOf('.');
      const decimalLength = (price + '.').split('.')[1].length;
      if(isDecimal > -1 && (decimalLength > 4)) { 
        window.alert('Price must not be smaller than 5 decimal places')
        throw new Error('Price must not be smaller than 5 decimal places')
      } else if((isDecimal > -1 && (decimalLength <= 4))){
        let amountZeros = 4-decimalLength;
        while (amountZeros > 0) {
          price = price + '0';
          amountZeros--;
        } 
      } else if (isDecimal <= -1) {
        price = price + '.0000';
      }
      console.log('The price is', price);  
      await eosUtil.setItem({ itemName: name, itemPrice: (price + ' EOS') })
        .catch(error => window.alert(`${error.toString()}`));
    },

    async pay({ state, commit }, price) {
      console.log('Pay in store called', price);

      await eosUtil.pay(price)
        .catch(error => window.alert(`${error.toString()}`));
    },

    async receivedItem({ commit }) {
      await eosUtil.itemReceived()
        .catch(error => window.alert(`${error.toString()}`));
    },
    async retractBuyer({ state }) {
      console.log('Mutation retractBuyer');
      eosUtil.retractBuyer(state.contractState.buyer)
        .catch(error => window.alert(`${error.toString()}`));
    },
    async retractSeller({ state }) {
      console.log('Mutation retractSeller');

      eosUtil.retractSeller(state.contractState.seller)
        .catch(error => window.alert(`${error.toString()}`));
    },
    async retractIntermed({ state }) {
      console.log('Mutation retractIntermed');
      eosUtil.retractIntermed(state.contractState.intermediator)
        .catch(error => window.alert(`${error.toString()}`));
    },
    async withdraw({ state }) {
      console.log('State is', state);
      eosUtil.withdrawSeller(state.contractState.seller)
        .catch(error => window.alert(`${error.toString()}`));
    },
    async withdrawAfterDisputeBuyer({ state }) {
      eosUtil.withdrawBuyer(state.contractState.buyer)
        .catch(error => window.alert(`${error.toString()}`));
    },
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

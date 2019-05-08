import eosUtil from '../../util/eosUtil';

/* eslint-disable */
export default {
  state: {
    errorFlag: false,
    errorMessage: null,
    loadingFlag: false,
    deployedContract: null,
    contractName: null,
    contractInstance: null,
    contractState: {
      retracted: false,
      agreement: {
        sellerRetract: false,
        buyerRetract: false,
        intermediatorRetract: false,
      },
      balance: null,
      itemSet: false,
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
    async connectToContract({ state, dispatch }, contractAddr) {
      
      try {
        await eosUtil.getContractData(contractAddr);
        state.contractName = contractAddr;
        dispatch('pollContract');
      } catch(error) {
        state.errorFlag = true;
        state.errorMessage = error.message ? error.message : error.toString()
      } finally {
        state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
      }
    },

    async deploy({ state }) {
      try {
        await eosUtil.deploy()
        state.deployedContract = eosUtil.getContractName();
      } catch (error) {
        state.errorFlag = true;
        state.errorMessage = error.message ? error.message : error.toString()
      } finally {
        state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
      }
    },

    async initialize({ state, dispatch }, initData) {
      try {
        const contractName = eosUtil.getContractName();
        await eosUtil.init(initData, contractName)    
        state.contractName = contractName;
        dispatch('pollContract')
      } catch (error) {
        state.errorFlag = true;
        state.errorMessage = error.message ? error.message : error.toString()
      } finally {
        state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
      }
    },
    

    async pollContract({ state, commit }) {
      if(state.contractName) {
        const data = await eosUtil.getContractData(state.contractName);
        commit('loadData', data);
      }
    },

    async loadData({ state, commit }) {
      if(state.contractName) {
        const data = await eosUtil.getContractData(state.contractName);
        commit('loadData', data);
      }
    },
    async setItem({ state, dispatch}, { name, price }) {
      if(name === '' || !name) {
        state.errorFlag = true;
        state.errorMessage = 'Empty name is not allowed, please insert a name'
        throw Error('Empty name is not allowed, please insert a name')
      } else if (price === 0 || !price) {
        state.errorFlag = true;
        state.errorMessage = 'Price must not be empty or 0'
        throw Error('Price must not be empty or 0')
      }
      const isDecimal = price.indexOf('.');
      const decimalLength = (price + '.').split('.')[1].length;
      if(isDecimal > -1 && (decimalLength > 4)) { 
        state.errorFlag = true;
        state.loadingFlag = true;
        state.errorMessage = error.message ? error.message : error.toString()
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
      try {
        await eosUtil.setItem({ itemName: name, itemPrice: (price + ' EOS') }, state.contractName)
        dispatch('pollContract')
      } catch(error) {
        
        state.errorFlag = true;
        state.errorMessage = error.message ? error.message : error.toString()
      } finally {
        state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
      }
    },

    async pay({ state, dispatch }, price) {
      try{
        await eosUtil.pay(price, state.contractName)
        dispatch('pollContract')
      } catch(error) {
        state.errorFlag = true;
        state.errorMessage = error.message ? error.message : error.toString()
      } finally {
        state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
      }
    },

    async receivedItem({ state, dispatch }) {
      try {
        await eosUtil.itemReceived(state.contractName)
        dispatch('pollContract')
      }
      catch(error) {
        state.errorFlag = true;
        state.errorMessage = error.message ? error.message : error.toString()
      } finally {
        state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
      }
    },
    async retractBuyer({ state, dispatch }) {
      try {
        await eosUtil.retractBuyer(state.contractState.buyer, state.contractName)
        dispatch('pollContract')
      }catch(error) {
        state.errorFlag = true;
        state.errorMessage = error.message ? error.message : error.toString()
      } finally {
        state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
      }
    },
    async retractSeller({ state, dispatch }) {
      try{
        await eosUtil.retractSeller(state.contractState.seller, state.contractName)
        dispatch('pollContract')
      }catch(error) {
        state.errorFlag = true;
        state.errorMessage = error.message ? error.message : error.toString()
      } finally {
        state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
      }
    },
    async retractIntermed({ state, dispatch }, buyerIsRight) {
      try{
        await eosUtil.retractIntermed(state.contractState.intermediator, buyerIsRight, state.contractName)
        dispatch('pollContract')
      } catch(error) {
        state.errorFlag = true;
        state.errorMessage = error.message ? error.message : error.toString()
      } finally {
        state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
      }
    },
    async withdraw({ state, dispatch }) {
      try {
        await eosUtil.withdrawSeller(state.contractState.seller, state.contractName)
        dispatch('pollContract')
      }catch(error) {
        state.errorFlag = true;
        state.errorMessage = error.message ? error.message : error.toString()
      } finally {
        state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
      }
    },
    async withdrawAfterDisputeBuyer({ state, dispatch }) {
      try {
        await eosUtil.withdrawBuyer(state.contractState.buyer, state.contractName)
        dispatch('pollContract')
      }catch(error) {
        state.errorFlag = true;
        state.errorMessage = error.message ? error.message : error.toString()
      } finally {
        state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
      }
    },
    async changeSeller({ state, dispatch }, newSellerAddress) {
      try {
        await eosUtil.changeSeller(newSellerAddress, state.contractName)
        dispatch('pollContract')
      }catch(error) {
        state.errorFlag = true;
        state.errorMessage = error.message ? error.message : error.toString()
      } finally {
        state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
      }
    },
  },
  getters: {
    getItem: state => state.contractState.item,
    getStatus: state => state.contractState.contractClosed,
    getAgreement: state => state.contractState.agreement,
    getBuyerIsPaidBack: state => state.contractState.buyerIsPaidBack,
    getBalance: state => state.contractState.balance,
    getContractName: state => state.contractName,
    getItemSet: state => state.contractState.itemSet,
  },
  mutations: {
    saveContract(state, payload) {
      state.contractInstance = payload;
    },
    loadData(state, payload) {
      state.contractState = payload;
    },
    changeLoadingFlag(state) {
      state.loadingFlag = false;
    },
    changeErrorFlagAndMessage(state) {
      state.errorFlag = false;
      state.errorMessage = null;
    }
  },
};

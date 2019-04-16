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
      console.log('ContractAddr in connectToContract store:', contractAddr);
      
      try {
        await eosUtil.getContractData(contractAddr);
        console.log('success in connection');
        state.contractName = contractAddr;
        dispatch('pollContract');
      } catch(error) {
        console.log(error);
        // window.alert(`${error.toString()}`)
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
        console.log('initialize in store', contractName);
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
        console.log('Loading InitialData');
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
      console.log('Set Item mutation called', price);
      console.log('Price index', (price.indexOf('.') > -1));
      console.log('decimal places', (price + '.').split('.')[1].length )
      const isDecimal = price.indexOf('.');
      const decimalLength = (price + '.').split('.')[1].length;
      if(isDecimal > -1 && (decimalLength > 4)) { 
        state.errorFlag = true;
        state.loadingFlag = true;
        state.errorMessage = error.message ? error.message : error.toString()
        // window.alert('Price must not be smaller than 5 decimal places')
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
      try {
        await eosUtil.setItem({ itemName: name, itemPrice: (price + ' EOS') }, state.contractName)
        dispatch('pollContract')
      } catch(error) {
        // window.alert(`${error.toString()}`);
        console.log(error);
        
        state.errorFlag = true;
        state.errorMessage = error.message ? error.message : error.toString()
      } finally {
        console.log('state loading flag in store', state.loadingFlag)
        state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
      }
    },

    async pay({ state, dispatch }, price) {
      console.log('Pay in store called', price);
      try{
        await eosUtil.pay(price, state.contractName)
        dispatch('pollContract')
      } catch(error) {
        // window.alert(`${error.toString()}`);
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
        // window.alert(`${error.toString()}`);
        state.errorFlag = true;
        state.errorMessage = error.message ? error.message : error.toString()
      } finally {
        state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
      }
    },
    async retractBuyer({ state, dispatch }) {
      console.log('Mutation retractBuyer');
      try {
        await eosUtil.retractBuyer(state.contractState.buyer, state.contractName)
        dispatch('pollContract')
      }catch(error) {
        // window.alert(`${error.toString()}`);
        state.errorFlag = true;
        state.errorMessage = error.message ? error.message : error.toString()
      } finally {
        state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
      }
    },
    async retractSeller({ state, dispatch }) {
      console.log('Mutation retractSeller');
      try{
        await eosUtil.retractSeller(state.contractState.seller, state.contractName)
        dispatch('pollContract')
      }catch(error) {
        // window.alert(`${error.toString()}`);
        state.errorFlag = true;
        state.errorMessage = error.message ? error.message : error.toString()
      } finally {
        state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
      }
    },
    async retractIntermed({ state, dispatch }, buyerIsRight) {
      console.log('Mutation retractIntermed');
      try{
        await eosUtil.retractIntermed(state.contractState.intermediator, buyerIsRight, state.contractName)
        dispatch('pollContract')
      } catch(error) {
        // window.alert(`${error.toString()}`);
        state.errorFlag = true;
        state.errorMessage = error.message ? error.message : error.toString()
      } finally {
        state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
      }
    },
    async withdraw({ state, dispatch }) {
      console.log('State is', state);
      try {
        await eosUtil.withdrawSeller(state.contractState.seller, state.contractName)
        dispatch('pollContract')
      }catch(error) {
        // window.alert(`${error.toString()}`);
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
        // window.alert(`${error.toString()}`);
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
      console.log('deploy mutation contract instance =', payload);
      state.contractInstance = payload;
    },
    loadData(state, payload) {
      state.contractState = payload;
    },
    changeLoadingFlag(state) {
      console.log('state loading flag change mutation')
      state.loadingFlag = false;
    },
    changeErrorFlagAndMessage(state) {
      state.errorFlag = false;
      state.errorMessage = null;
    }
  },
};

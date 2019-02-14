import Vue from 'vue';
import Vuex from 'vuex';
import eosStore from './modules/eosStore';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  },
  modules: {
    eosModule: eosStore,
  },
  getters: {
  },
});

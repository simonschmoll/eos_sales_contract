import Vue from 'vue';
import Vuetify from 'vuetify';
import App from './App.vue';
import store from './store';
import router from './router';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify, {
  theme: {
    primary: '#1565C0',
    secondary: '#90CAF9',
    accent: '#0D47A1',
    error: '#E53935',
    info: '#FFEE58',
    success: '#00C853',
    warning: '#FF6D00',
  },
});

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app');

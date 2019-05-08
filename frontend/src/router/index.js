import Vue from 'vue';
import Router from 'vue-router';
import SalesContract from '../Sales/SalesContract.vue';
import Deploy from '../Deploy/Deploy.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Sales',
      components: {
        default: SalesContract,
        deploy: Deploy,
      },
    },
  ],
});

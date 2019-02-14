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
  //   {
  //     path: '/build',
  //     name: 'Build',
  //     components: {
  //       default: RobotBuilder,
  //       sidebar: SidebarBuild,
  //     },
  //   },
  //   {
  //     path: '/parts/browse',
  //     name: 'BrowseParts',
  //     component: BrowseParts,
  //     children: [
  //       {
  //         name: 'BrowseHeads',
  //         path: 'heads',
  //         component: RobotHeads,
  //       },
  //       {
  //         name: 'BrowseArms',
  //         path: 'arms',
  //         component: RobotArms,
  //       },
  //       {
  //         name: 'BrowseTorsos',
  //         path: 'torsos',
  //         component: RobotTorsos,
  //       },
  //       {
  //         name: 'BrowseBases',
  //         path: 'bases',
  //         component: RobotBases,
  //       },
  //     ],
  //   }, {
  //     path: '/parts/:partType/:id',
  //     name: 'Parts',
  //     component: PartInfo,
  //     props: true,
  //     beforeEnter(to, from, next) {
  //       const isValidId = Number.isInteger(Number(to.params.id));
  //       next(isValidId);
  //     },
  //   },
  //   {
  //     path: '/cart',
  //     name: 'Cart',
  //     component: ShoppingCart,
  //   },
  ],
});

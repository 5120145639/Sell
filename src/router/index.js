import Vue from 'vue';
import Router from 'vue-router';

import Goods from '../components/Goods/Goods.vue';
import Ratings from '../components/Ratings/Ratings.vue';
import Seller from '../components/Seller/Seller.vue';

Vue.use(Router);
export default new Router({
  routes: [
    {path: '/', redirect: '/goods'},
    {path: '/goods', component: Goods},
    {path: '/ratings', component: Ratings},
    {path: '/seller', component: Seller}
  ],
  linkActiveClass: 'active'
});

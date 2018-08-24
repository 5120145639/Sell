// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';

// 引入stylus样式
import './common/stylus/index.styl';
// 引入vue-resource
import VueResource from 'vue-resource';
Vue.use(VueResource);
// Vue.http.options.root = 'localhost';
// Vue.http.options.emulateJSON = true;

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
    msg: 'hello world'
  },
  router,
  components: { App },
  template: '<App/>'
});

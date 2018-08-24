<template>
  <div>
    <div class="header">
      <Header :seller="seller"></Header>
    </div>
    <div class="tab border-1px">
      <router-link class="tab-item" to="/goods">商品</router-link>
      <router-link class="tab-item" to="/ratings">评论</router-link>
      <router-link class="tab-item" to="/seller">商家</router-link>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>
<script>
  import Header from './components/header/Header.vue';
  import {urlParse} from 'common/js/util.js';
  export default {
    data() {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse();
            console.log(queryParam);
            return queryParam.id;
          })()
        }
      };
    },
    methods: {
      getSellers() {
        this.$http.get('/api/seller').then((result) => {
          if (result.body.errno === 0) {
            // this.seller = result.body.data;
            this.seller = Object.assign({}, this.seller, result.body.data);
          }
        });
      }
    },
    created() {
      this.getSellers();
    },
    components: {
      Header
    }
  };
</script>
<style lang="stylus" scoped>
  @import "./common/stylus/mixin.styl";
  .tab
    display:flex;
    width:100%;
    height: 40px;
    line-height:40px;
    // border-bottom:1px solid rgba(7,17,27,0.1);
    border-1px(rgba(7,17,27,0.1));
    .tab-item
      flex:1;
      text-align:center;
      &>a
        display:block;
        font-size:14px;
        color:rgb(77,85,93);
        &.active
          color:rgb(240,20,20);
</style>

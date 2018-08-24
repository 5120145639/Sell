<template>
    <div class="goods">
        <div class="menu-wrapper" ref="menuScroll">
            <ul>
                <li :class="{'menu-item':true,'current':currentIndex === i}" v-for="(item,i) in goods" :key="i" @click="selectMenu(i,$event)">
                    <span class="text border-1px">
                        <span v-if="item.type>0" :class="['icon',classMap[item.type]]"></span>{{item.name}}
                    </span>
                </li>
            </ul>
        </div>
        <div class="foods-wrapper" ref="foodsScroll">
            <ul>
                <li v-for="(item,i) in goods" :key="i" class="foods-list" ref="foodsListHook">
                    <h1 class="title">{{item.name}}</h1>
                    <ul>
                        <li v-for="(food,i) in item.foods" :key="i" class="food-item" @click="selectFood(food,$event)">
                            <div class="icon">
                                <img :src="food.icon" alt="">
                            </div>
                            <div class="content">
                                <h2 class="name">{{food.name}}</h2>
                                <p class="desc">{{food.description}}</p>
                                <div class="extra">
                                    <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                                </div>
                                <div class="price">
                                    <span class="now">￥{{food.price}}</span><span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <cartControl :food="food" @add="addFood"></cartControl>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <ShopCar ref="shopCar" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></ShopCar>
        <food :food="selectedFood" @add="addFood" ref="food"></food>
    </div>
</template>
<script>
import BScroll from 'better-scroll';
import ShopCar from '../Shopcar/ShopCar.vue';
import cartControl from '../CartControl/cartControl.vue';
import food from '../Food/food.vue';
export default {
    data() {
        return {
            goods: [],
            listHeight: [],
            scrollY: 0,
            classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
            selectedFood: {}
        };
    },
    components: {
        ShopCar,
        cartControl,
        food
    },
    props: ['seller'],
    created() {
        this.getGoods();
    },
    methods: {
        getGoods() {
            this.$http.get('/api/goods').then(result => {
                if (result.body.errno === 0) {
                    this.goods = result.body.data;
                    this.$nextTick(() => {
                        this._calculateHeight();
                        this._initScroll();
                    });
                }
            });
        },
        _initScroll() {
            this.menuScroll = new BScroll(this.$refs.menuScroll, {
                click: true
            });
            this.foodsScroll = new BScroll(this.$refs.foodsScroll, {
                click: true,
                probeType: 3
            });
            this.foodsScroll.on('scroll', (pos) => {
                this.scrollY = Math.abs(Math.round(pos.y));
            });
            // console.log(this.menuScroll);
            // console.log(this);
        },
        _calculateHeight() {
            let foodsList = this.$refs.foodsListHook;
            let height = 0;
            this.listHeight.push(height);
            for (let i = 0; i < foodsList.length; i++) {
                height += foodsList[i].clientHeight;
                this.listHeight.push(height);
            }
        },
        selectMenu(index, event) {
            if (!event._constructed) {
                return;
            }
            let foodsList = this.$refs.foodsListHook;
            let el = foodsList[index];
            this.foodsScroll.scrollToElement(el, 300);
            // console.log(index);
        },
        addFood(target) { // 接收cartControl传来的event.target
            // 通过Goods将target从cartControl传递到shopCar
            // console.log(this.$refs.shopCar.drop(target));
            this._drop(target);
        },
        _drop(target) {
            this.$nextTick(() => { // 优化小球动画
                this.$refs.shopCar.drop(target);
            });
        },
        selectFood(food, event) { // food.vue组件获取food
            if (!event._constructed) { // 避免触发BScroll的click
                return;
            }
           this.selectedFood = food;
           this.$refs.food.show();
        }
    },
    computed: {
        currentIndex() {
            // console.log(this.scrollY);
            for (let i = 0; i < this.listHeight.length; i++) {
                let h1 = this.listHeight[i];
                let h2 = this.listHeight[i + 1];
                if (!h2 || (this.scrollY >= h1 && this.scrollY < h2)) {
                    return i;
                }
            }
            return 0;
        },
        selectFoods() {
            let foods = [];
            this.goods.forEach((good) => {
                good.foods.forEach((food) => {
                   if (food.count) {
                       foods.push(food);
                   }
                });
            });
            return foods;
        }
    },
    mounted() {
        console.log(this.goods.length);
        this.$nextTick(function() {
            console.log(this.$refs);
            console.log(this.$refs.foodsListHook);
        });
    }
};
</script>
<style lang="stylus" scoped>
    @import '../../common/stylus/mixin.styl'
    .goods
      display: flex
      position: absolute
      top: 174px
      bottom: 46px
      width: 100%
      overflow: hidden
      .menu-wrapper
        flex: 0 0 80px
        width: 80px
        background: #f3f5f7
        .menu-item
          display: table
          height: 54px
          width: 56px
          line-height: 14px
          padding: 0 12px
          &.current
            position: relative
            margin-top: -1px
            z-index: 10
            background: #fff
            font-weight: 700
            .text
              border-none()
          .icon
            display: inline-block
            width: 12px
            height: 12px
            vertical-align:top
            margin-right: 2px
            background-size: 12px 12px
            background-repeat: no-repeat
            &.decrease
                bg-image('decrease_3')
            &.discount
                bg-image('discount_3')
            &.guarantee
                bg-image('guarantee_3')
            &.invoice
                bg-image('invoice_3')
            &.special
                bg-image('special_3')
          .text
            display: table-cell
            width: 56px
            vertical-align: middle
            font-size: 12px
            border-1px(rgba(7,17,27,0.1))
      .foods-wrapper
        flex: 1
        .title
          padding-left: 14px
          height: 26px
          line-height: 26px
          border-left: 2px solid #d9dde1
          font-size: 12px
          color: rgb(147,153,159)
          background: #f3f5f7
        .food-item
          display: flex
          margin: 18px
          padding-bottom: 18px
          border-1px(rgba(7,17,27,0.1))
          &:last-child
            border-none()
            margin-bottom: 0
          .icon
            flex: 0 0 57px
            margin-right: 10px
          .content
            flex: 1
            .name
              margin: 2px 0 8px 0
              height: 14px
              line-height: 14px
              font-size: 14px
              color: rgb(7,17,27)
            .desc,.extra
              font-size: 10px
              line-height: 10px
              color: rgb(147,153,159)
            .desc
              line-height: 12px
              margin-bottom: 8px
            .extra
              .count
                margin-right: 12px
            .price
              font-weight: 700
              line-height: 24px
              .now
                margin-right: 18px
                font-size: 14px
                color: rgb(240,20,20)
              .old
                text-decoration: line-through
                font-size: 10px
                color: rgb(147,153,159)
            .cartcontrol-wrapper
              position: absolute
              right: 0
              bottom: 12px
</style>

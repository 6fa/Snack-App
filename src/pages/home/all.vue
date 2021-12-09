<template>
  <div class="all">
    <div class="title">最新零食</div>
    <div class="list-wrapper">
      <div class="list-item" v-for="item in productList" :key="item._id">
        <router-link :to="{ name: 'product', params: item }">
          <div class="product-title">
            <div class="title-text">{{ item.productName }}</div>
          </div>
          <div class="product-pic">
            <img :src="item.productPic" />
          </div>
          <div class="product-state">
            <div class="collection state">
              <i class="iconfont">&#xe65b;</i>
              <span class="num">{{ item.collectNum | number }}</span>
            </div>
            <div class="like state">
              <i class="iconfont">&#xe658;</i>
              <span class="num">{{ item.likeNum | number }}</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { getProducts } from "@/api/product.js";
import defaultPic from "@/assets/pictures/orange.png";
export default {
  name: "all-list",
  data() {
    return {
      productList: []
    };
  },
  filters: {
    number: function(val) {
      if (val >= 100) {
        if (val >= 1000) {
          return (val = "1k+");
        } else {
          return (val = "99+");
        }
      } else {
        return val;
      }
    }
  },
  created() {
    //获取商品信息
    this.getNewProducts(0);
  },
  methods: {
    getNewProducts(num) {
      let data = { pageNum: num, pageSize: 10 };
      getProducts(data)
        .then(res => {
          console.log("普通零食", res);
          if (res.data.code == 200) {
            if (res.data.data.length == 0) {
              this.$emit("loadedAll");
              return;
            }
            let arr = res.data.data;
            for (let item of arr) {
              if (!item.productPic) {
                item.productPic = defaultPic;
              }
            }
            this.productList.push(...arr);
          }
        })
        .then(() => {
          this.$emit("updateFinish");
        })
        .catch(err => {
          console.log(err);
        });
    },
    reset() {
      this.productList = [];
      this.getNewProducts(0);
    }
  }
};
</script>

<style scoped lang="scss">
@import "~assets/scss/_variables.scss";
@import "~assets/scss/_mixins.scss";

[data-dpr="1"] .list-item {
  .num {
    font-size: 16px;
  }
  .iconfont,
  .product-title {
    font-size: 16px;
  }
  .product-pic {
    height: 120px;
  }
}
[data-dpr="2"] .list-item {
  .num {
    font-size: 32px;
  }
  .iconfont,
  .product-title {
    font-size: 32px;
  }
}
[data-dpr="3"] .list-item {
  .num {
    font-size: 48px;
  }
  .iconfont,
  .product-title {
    font-size: 48px;
  }
}
.all {
  width: 100%;
  padding: 0 1.5rem;
  color: grey;
  .title {
    width: 100%;
    background-color: $border-color;
    border-radius: 8px;
    color: $font-color;
    font-size: 0.8rem;
    height: 1.5rem;
    line-height: 1.5rem;
    text-align: center;
  }
  .list-wrapper {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    .list-item {
      width: 7.5rem;
      height: 10.5rem;
      color: grey;
      background-color: #fff;
      border: 1px solid $border-color;
      box-shadow: 0 0 5px 0 lightgrey;
      padding: 12px;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-top: 30px;
      .product-title {
        width: 100%;
        text-align: center;
        padding-bottom: 0.5rem;
        .title-text {
          @include ellipsis();
        }
      }
      .product-pic {
        width: 100%;
        height: 7rem; //
        display: flex;
        justify-content: center;
        img {
          width: 100%;
        }
      }
      .product-state {
        height: 2rem; //
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        .iconfont {
          color: orange;
        }
      }
    }
  }
}
</style>

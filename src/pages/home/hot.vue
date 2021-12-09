<template>
  <div class="hot">
    <div class="title">热门零食榜</div>
    <div class="product-list">
      <div v-for="item in productArray" :key="item._id">
        <router-link
          :to="{ name: 'product', params: item }"
          class="product-box"
        >
          <div class="left">
            <img :src="item.productPic ? item.productPic : imgsrc" />
          </div>
          <div class="right">
            <div class="product-desc">{{ item.productName }}</div>
            <div class="product-like">
              <i class="iconfont">&#xe658;{{ item.likeNum }}</i>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { getHotProducts } from "@/api/product.js";
import pic from "@/assets/pictures/orange.png";
export default {
  name: "hot-product",
  data() {
    return {
      productArray: [],
      imgsrc: pic
    };
  },
  created() {
    //获取商品信息
    this.getHotPds();
  },
  methods: {
    getHotPds() {
      let data = { num: 3 };
      getHotProducts(data)
        .then(res => {
          console.log("热门零食", res);
          if (res.data.code == 200) {
            this.productArray = res.data.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped lang="scss">
@import "~assets/scss/_variables.scss";
@import "~assets/scss/_mixins.scss";
.hot {
  width: 100%;
  padding: 0 1.5rem;
  color: grey;
  .title {
    width: 100%;
    // background-color: #f7f7e8;
    background-color: $border-color;
    border-radius: 8px;
    color: $font-color;
    font-size: 0.8rem;
    height: 1.5rem;
    line-height: 1.5rem;
    text-align: center;
  }
}
[data-dpr="1"] .product-box {
  width: 250px;
  height: 150px;
  padding: 5px;
  margin-top: 10px;
  .right {
    font-size: 16px;
    .product-desc {
      width: 100px;
    }
    .iconfont {
      font-size: 16px;
    }
  }
}
[data-dpr="2"] .product-box {
  width: 500px;
  height: 300px;
  padding: 10px;
  margin-top: 20px;
  .right {
    font-size: 32px;
    .product-desc {
      width: 200px;
    }
    .iconfont {
      font-size: 32px;
    }
  }
}
[data-dpr="3"] .product-box {
  width: 750px;
  height: 450px;
  padding: 15px;
  margin-top: 30px;
  .right {
    font-size: 48px;
    .product-desc {
      width: 300px;
    }
    .iconfont {
      font-size: 48px;
    }
  }
}
.hot {
  .product-list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    .product-box {
      background-color: #fff;
      border: 1px solid $border-color;
      box-shadow: 0 0 10px 3px rgb(238, 238, 238);
      border-radius: 12px;
      display: flex;
      justify-content: space-between;

      .left,
      .right {
        height: 100%;
        width: 50%;
        @include flex-center();
      }
      .left {
        img {
          width: 100%;
          height: 100%;
        }
      }
      .right {
        @include flex-center(column);
        .product-desc {
          color: $font-color;
          line-height: 2em;
          text-align: center;
          @include ellipsis();
        }
        .product-like {
          color: rgb(226, 114, 114);
        }
      }
    }
  }
}
</style>

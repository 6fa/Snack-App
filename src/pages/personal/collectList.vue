<template>
  <div class="collect-list">
    <p
      class="item"
      v-for="item in collectListArr"
      :key="item._id"
      @click="toProductPage(item)"
    >
      <span class="title">{{ item.productName }}</span>
      <span class="like"
        ><i class="iconfont">&#xe658;</i>{{ item.likeNum }}</span
      >
      <span class="cancel" @click="deletePd($event, item._id)">取消收藏</span>
    </p>
  </div>
</template>

<script>
import { getUserCollect, delUserCollect } from "@/api/like";
export default {
  name: "collectedList",
  data() {
    return {
      collectListArr: [] //收藏的商品数据
    };
  },
  created() {
    //获取收藏列表
    this.collectList();
  },
  methods: {
    collectList() {
      let data = { userName: this.$store.state.userName };
      getUserCollect(data)
        .then(res => {
          if (res.data.code == 200) {
            this.collectListArr = res.data.data;
            this.$emit("collectNumber", this.collectListArr.length);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    toProductPage(data) {
      this.$router.push({ name: "product", params: data });
    },
    deletePd(e, id) {
      e.stopPropagation();
      console.log(id);
      delUserCollect({ productId: id, userName: this.$store.state.userName })
        .then(res => {
          console.log("取消收藏", res);
          this.collectList();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped lang="scss">
@import "~assets/scss/_mixins.scss";
@import "~assets/scss/_variables.scss";
.collect-list {
  width: 100%;
  .item {
    color: rgb(100, 100, 100);
    width: 100%;
    margin-bottom: 0.5rem;
    background-color: #fff;
    box-shadow: 0 0 10px 0 lightgrey;
    border-radius: 20px;
    height: 1.8rem;
    padding: 0 10px;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
    .title {
      display: inline-block;
      flex-shrink: 0;
      width: 6rem;
      @include ellipsis();
    }
    .cancel {
      position: absolute;
      right: 20px;
      color: $font-color;
    }
    .like {
      .iconfont {
        font-size: 0.8rem;
        color: orange;
      }
      font-size: 0.8rem;
    }
  }
}
</style>

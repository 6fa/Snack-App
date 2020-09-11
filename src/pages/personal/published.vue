<template>
  <div class="publish-List">
    <p
      class="item"
      v-for="item in publishListArr"
      :key="item._id"
      @click="toProductPage(item)"
    >
      <span class="title">{{ item.productName }}</span>
      <span class="like"
        ><i class="iconfont">&#xe658;</i>{{ item.likeNum }}</span
      >
      <span class="delete" @click="deletePd($event, item._id)">删除</span>
    </p>
  </div>
</template>

<script>
import { getUserPublish, delUserPublish } from "@/api/product";
export default {
  name: "publishedList",
  data() {
    return {
      publishListArr: [] //发布的商品数据
    };
  },
  created() {
    //获取发布列表
    this.publishList();
  },
  methods: {
    publishList() {
      let data = { userName: this.$store.state.userName };
      getUserPublish(data)
        .then(res => {
          console.log("发布列表", res);
          if (res.data.code == 200) {
            this.publishListArr = res.data.data;
            this.$emit("publishNumber", this.publishListArr.length);
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
      delUserPublish({ _id: id, publisher: this.$store.state.userName })
        .then(res => {
          console.log("删除发布", res);
          this.publishList();
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
.publish-List {
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
    .delete {
      position: absolute;
      right: 20px;
      color: $font-color;
    }
    .like,
    .msg {
      .iconfont {
        font-size: 0.8rem;
        color: orange;
      }
      font-size: 0.8rem;
    }
  }
}
</style>

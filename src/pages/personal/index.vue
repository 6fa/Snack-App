<template>
  <div class="personal-page-wrapper">
    <router-view />
    <base-scroll ref="scroll" @scroll-end="scrollEnd">
      <div class="personal-page">
        <div class="user-info">
          <div class="user-edit" @click="toEditPage">编辑&gt;</div>
          <div class="user-pic">
            <img :src="userImgUrl"/>
          </div>
          <div class="user-name">{{ username }}</div>
        </div>

        <div class="data-exhibition">
          <div class="published-num">
            <p class="data">{{ this.publishedNum }}</p>
            <p class="title">发布</p>
          </div>
          <div class="recommend-num">
            <p class="data">{{ this.collectedNum }}</p>
            <p class="title">收藏</p>
          </div>
        </div>

        <div class="user-published">
          <p class="title">
            我的发布<span class="show-list-btn" @click="pubShowHide"></span>
          </p>
          <published-list
            class="list hide"
            ref="pubList"
            @publishNumber="setPublishNum"
          />
        </div>

        <div class="user-collected">
          <p class="title">
            我的收藏<span class="show-list-btn" @click="colShowHide"></span>
          </p>
          <collect-list
            class="list hide"
            ref="colList"
            @collectNumber="setCollectNum"
          />
        </div>
      </div>
    </base-scroll>
    <base-backtop
      :visible="isBacktopVisible"
      class="back-to-top"
      @backtop="backToTop"
    />
  </div>
</template>

<script>
import baseScroll from "base/scroll";
import BaseBacktop from "base/backtop";
import publishedList from "./published";
import collectList from "./collectList";
import headpic from "assets/pictures/orange.png";
export default {
  name: "personalPage",
  data() {
    return {
      userImgUrl: headpic,
      username: "未知",
      pubFlag: false,
      colFlag: false,
      isBacktopVisible: false, //返回顶部按钮
      publishedNum: 0, //发布数
      collectedNum: 0 //收藏数
    };
  },
  components: {
    publishedList,
    collectList,
    baseScroll,
    BaseBacktop
  },
  created() {
    const state = this.$store.state;
    if (state.isloaded) {
      this.username = state.userName;
      const userHead = state.userHead
      if(userHead && userHead !== 'undefined'){
        this.userImgUrl = userHead;
      }
    }
  },
  methods: {
    showHide(flag, el) {
      flag = !flag;
      if (flag) {
        el.classList.remove("hide");
      } else {
        el.classList.add("hide");
      }
      return flag;
    },
    pubShowHide(e) {
      e.target.classList.toggle("active");
      let re = this.showHide(this.pubFlag, this.$refs.pubList.$el);
      this.pubFlag = re;
      this.updateScroll();
    },
    colShowHide(e) {
      e.target.classList.toggle("active");
      let re = this.showHide(this.colFlag, this.$refs.colList.$el);
      this.colFlag = re;
      this.updateScroll();
    },
    updateScroll() {
      let timer = setTimeout(() => {
        clearTimeout(timer);
        this.$refs.scroll.updateScroll();
      }, 500);
    },
    backToTop() {
      this.$refs.scroll && this.$refs.scroll.scrollToTop();
    },
    scrollEnd(translate, swiper) {
      this.isBacktopVisible = translate < 0 && -translate > swiper.height / 3;
    },
    toEditPage() {
      this.$router.push("/personal/edit");
    },
    //发布数目
    setPublishNum(num) {
      this.publishedNum = num;
    },
    //收藏数目
    setCollectNum(num) {
      this.collectedNum = num;
    }
  }
};
</script>

<style scoped lang="scss">
@import "~assets/scss/_mixins.scss";
@import "~assets/scss/_variables.scss";
.personal-page-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.personal-page {
  width: 100%;
  padding: 50px 30px 30px 30px;
  font-size: 0.8rem;
  .user-info {
    position: relative;
    width: 100%;
    color: $font-color;
    background-color: #fff;
    @include flex-center(column);
    .user-pic {
      padding: 20px 0;
      height: 4rem;
      width: 4rem;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .user-edit {
      position: absolute;
      top: 0;
      right: 0.5rem;
      color: orange;
    }
  }
  .data-exhibition {
    width: 100%;
    padding: 0.5rem 0;
    color: grey;
    background-color: #fff;
    @include flex-center();
    .published-num,
    .recommend-num {
      padding: 0 1rem;
      @include flex-center(column);
    }
  }
  .user-published,
  .user-collected {
    margin-top: 2rem;
    width: 100%;
    .title {
      color: $font-color;
      // border-bottom: 1px solid $border-color;
      border-bottom: 2px solid rgb(243, 195, 105);
      height: 1.5rem;
      line-height: 1.5rem;
      text-indent: 1rem;
    }
    .show-list-btn {
      display: inline-block;
      margin: 0 0.4rem;
      border-left: 0.4rem solid transparent;
      border-right: 0.4rem solid transparent;
      border-bottom: 0.6rem solid orange;
      transition: all 0.3s;
      &.active {
        transform: rotate(180deg);
      }
    }
    .list {
      padding: 1rem 1.5rem;
      transition: all 0.5s;
      width: 100%;
      &.hide {
        transform: scale(0);
        height: 0;
      }
    }
  }
}
.back-to-top {
  position: absolute;
  bottom: 4rem;
  right: 2rem;
  z-index: $backtop-z-index;
}
</style>
